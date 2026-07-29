import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductByIdAsync } from '@/data/products';
import { calculateProcessingFee } from '@/lib/orderFees';
import { getDrivingMilesFromOrigin } from '@/lib/googleMaps';
import { getDeliveryQuote } from '@/lib/deliveryPricing';
import { validateCoupon } from '@/lib/coupons';

// Ensures a real Stripe Coupon object exists for a given percent-off, reusing it across
// orders (stable, deterministic id) instead of creating a new one per checkout.
async function getOrCreateStripeCoupon(percentOff: number): Promise<string> {
  const id = `welcome-${percentOff}-percent`;
  try {
    await stripe.coupons.retrieve(id);
  } catch {
    await stripe.coupons.create({ id, percent_off: percentOff, duration: 'once' });
  }
  return id;
}

const SHIPPING_COST = 15;

// Re-validates delivery fee server-side — the client's mileage-based quote is never trusted
// on its own, same principle already applied to product price/stock.
async function validateDeliveryFee(
  type: string,
  address: string,
  subtotal: number
): Promise<{ fee: number; eligible: boolean }> {
  if (type === 'pickup') return { fee: 0, eligible: true };
  if (type === 'shipping') return { fee: SHIPPING_COST, eligible: true };
  if (type === 'delivery') {
    const miles = await getDrivingMilesFromOrigin(address);
    return getDeliveryQuote(miles, subtotal);
  }
  return { fee: 0, eligible: true };
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, deliveryInfo, couponCode } = await request.json();

    // Validar que haya items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validar información del cliente
    if (!customerInfo?.email || !customerInfo?.name) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // 🔒 VALIDAR CADA PRODUCTO CON STRAPI
    let validatedSubtotal = 0;
    const validatedLineItems = await Promise.all(
      items.map(async (item: any) => {
        try {
          // Consultar precio real desde Strapi
          const strapiProduct = await getProductByIdAsync(item.product.id);

          if (!strapiProduct) {
            console.error(`Product not found in Strapi: ${item.product.id}`);
            throw new Error(`Product ${item.product.name} is no longer available`);
          }

          const realPrice = strapiProduct.price;

          // Verificar que el precio coincida (tolerancia de 0.01 por redondeo)
          if (Math.abs(realPrice - item.product.price) > 0.01) {
            console.warn(`Price mismatch detected for ${item.product.id}:`, {
              frontendPrice: item.product.price,
              strapiPrice: realPrice,
              productName: item.product.name,
            });

            // Usar el precio de Strapi (la fuente de verdad)
            // En producción, podrías rechazar la transacción o notificar al usuario
          }

          // 🔒 VALIDAR REPARTO DE SABORES POR CHECKBOXES (cajas y productos regulares con flavors)
          const boxFlavors = item.boxFlavors as { flavor: string; quantity: number }[] | undefined;
          if (boxFlavors) {
            const uniqueFlavors = new Set(boxFlavors.map((f) => f.flavor));
            const total = boxFlavors.reduce((sum, f) => sum + f.quantity, 0);
            const validFlavorNames = new Set(strapiProduct.flavors ?? []);

            const basicInvalid =
              boxFlavors.length === 0 ||
              boxFlavors.length > 3 ||
              uniqueFlavors.size !== boxFlavors.length ||
              boxFlavors.some((f) => !validFlavorNames.has(f.flavor)) ||
              total < 1;

            const boxInvalid =
              strapiProduct.isSoldInBox && (!strapiProduct.boxSize || total !== strapiProduct.boxSize);

            if (basicInvalid || boxInvalid) {
              throw new Error(`Invalid flavor selection for ${strapiProduct.name}`);
            }
          } else if (strapiProduct.isSoldInBox) {
            throw new Error(`Invalid flavor selection for ${strapiProduct.name}`);
          }

          // Validar cantidad — con reparto de sabores, la cantidad es la suma del reparto
          const requestedQuantity = boxFlavors
            ? boxFlavors.reduce((sum, f) => sum + f.quantity, 0)
            : item.quantity;
          const validQuantity = Math.max(1, Math.min(100, requestedQuantity));
          validatedSubtotal += realPrice * validQuantity;

          // 🔒 Disponibilidad real (sin exponer cantidades de stock al cliente)
          const availableStock = strapiProduct.stock ?? 0;
          if (validQuantity > availableStock) {
            throw new Error('One or more items in your cart are currently unavailable. Please remove them and try again.');
          }

          const description = item.boxFlavors?.length
            ? `Flavors: ${item.boxFlavors.map((f: { flavor: string; quantity: number }) => `${f.flavor} x${f.quantity}`).join(', ')}`
            : item.flavor
            ? `Flavor: ${item.flavor}`
            : item.customMessage
            ? `Message: "${item.customMessage}"`
            : undefined;

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: strapiProduct.name,
                description,
                images: strapiProduct.image ? [strapiProduct.image] : [],
                metadata: { productId: strapiProduct.id },
              },
              unit_amount: Math.round(realPrice * 100), // 🔒 PRECIO VALIDADO DE STRAPI
            },
            quantity: validQuantity,
          };
        } catch (error) {
          console.error(`Error validating product ${item.product.id}:`, error);
          throw error instanceof Error ? error : new Error(`Unable to validate product: ${item.product.name}`);
        }
      })
    );

    // 🔒 MÍNIMO DE ORDEN
    if (validatedSubtotal < 20) {
      return NextResponse.json(
        { error: 'Your cart subtotal must be at least $20 to check out.' },
        { status: 400 }
      );
    }

    // 🔒 VALIDAR DELIVERY FEE EN EL BACKEND (millas reales vía Google Maps para delivery)
    let validatedDeliveryFee: number;
    try {
      const quote = await validateDeliveryFee(
        deliveryInfo.type,
        deliveryInfo.address || '',
        validatedSubtotal
      );
      if (!quote.eligible) {
        return NextResponse.json(
          { error: 'This address is outside our 25-mile delivery radius. Please choose shipping or in-store pickup instead.' },
          { status: 400 }
        );
      }
      validatedDeliveryFee = quote.fee;
    } catch (error) {
      console.error('Error validating delivery fee:', error);
      return NextResponse.json(
        { error: 'Could not calculate delivery for this address. Please double-check it or choose shipping/pickup instead.' },
        { status: 400 }
      );
    }

    // Verificar si el fee del frontend coincide con el calculado
    const frontendFee = deliveryInfo.fee || 0;
    if (Math.abs(validatedDeliveryFee - frontendFee) > 0.01) {
      console.warn('Delivery fee mismatch:', {
        frontend: frontendFee,
        validated: validatedDeliveryFee,
        type: deliveryInfo.type,
        address: deliveryInfo.address,
      });
      // Usar el fee validado del backend
    }

    // Agregar delivery fee como línea separada si existe
    if (validatedDeliveryFee > 0) {
      validatedLineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: deliveryInfo.type === 'shipping' ? 'Shipping' : 'Delivery Fee',
            description: deliveryInfo.type === 'shipping'
              ? 'Nationwide shipping'
              : `Delivery to ${deliveryInfo.address}`,
            images: [],
            metadata: { productId: '' },
          },
          unit_amount: Math.round(validatedDeliveryFee * 100), // 🔒 FEE VALIDADO
        },
        quantity: 1,
      });
    }

    // Crear sesión de checkout de Stripe con items validados
    const processingFee = calculateProcessingFee(validatedSubtotal + validatedDeliveryFee);
    if (processingFee > 0) {
      validatedLineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Card processing fee',
            description: undefined,
            images: [],
            metadata: { productId: '' },
          },
          unit_amount: Math.round(processingFee * 100),
        },
        quantity: 1,
      });
    }

    // 🔒 CUPÓN — validado contra la lista fija del servidor, nunca se confía en el % que mande el cliente
    let discounts: { coupon: string }[] | undefined;
    let appliedCouponCode: string | undefined;
    if (couponCode) {
      const { valid, percentOff } = validateCoupon(couponCode);
      if (!valid) {
        return NextResponse.json({ error: 'That discount code is not valid.' }, { status: 400 });
      }
      discounts = [{ coupon: await getOrCreateStripeCoupon(percentOff) }];
      appliedCouponCode = couponCode.trim().toUpperCase();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validatedLineItems, // 🔒 ITEMS CON PRECIOS VALIDADOS
      mode: 'payment',
      discounts,
      success_url: `${request.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?canceled=1`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        couponCode: appliedCouponCode || '',
        deliveryType: deliveryInfo.type,
        deliveryDate: deliveryInfo.date || '',
        deliveryTime: deliveryInfo.time || '',
        deliveryAddress: deliveryInfo.address || '',
        processingFee: processingFee.toFixed(2),
      },
      shipping_address_collection: deliveryInfo.type === 'shipping' || deliveryInfo.type === 'delivery'
        ? { allowed_countries: ['US'] }
        : undefined,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);

    // Proporcionar mensaje de error más específico al usuario
    const errorMessage = error.message || 'Unable to process checkout';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
