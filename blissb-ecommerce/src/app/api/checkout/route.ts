import { NextRequest, NextResponse } from 'next/server';
import { stripe, chunkMetadata } from '@/lib/stripe';
import { getProductByIdAsync } from '@/data/products';
import { calculateProcessingFee } from '@/lib/orderFees';
import { getDrivingMilesFromOrigin } from '@/lib/googleMaps';
import { getDeliveryQuote } from '@/lib/deliveryPricing';
import { validateCoupon } from '@/lib/coupons';

const SHIPPING_COST = 15;

// Verified directly against Stripe's live tax-codes API (not the account's
// default, which was "Electronically Supplied Services" — wrong for a
// bakery). Set explicitly per line item rather than relying on the Dashboard
// default, per Stripe's own recommendation, so a later unrelated change to
// the account default can't silently drift tax collection.
const FOOD_TAX_CODE = 'txcd_40040000'; // Food for Non-Immediate Consumption — off-premises pickup/delivery/shipping, which is all we do
const SHIPPING_TAX_CODE = 'txcd_92010001'; // Shipping

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

// Compact per-item snapshot stashed in the PaymentIntent's metadata (see
// chunkMetadata in lib/stripe.ts). A PaymentIntent has no line_items like a
// Checkout Session does, so the webhook needs *something* to re-fetch full
// product details (name/price/image) from Strapi with — this is deliberately
// minimal (no name/price here) since the webhook re-validates from Strapi
// anyway, which is more trustworthy than echoing back what the client sent.
type CompactItem = {
  id: string;
  q: number;
  f?: string;
  bf?: { flavor: string; quantity: number }[];
};

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, deliveryInfo, shippingAddress, billingAddress, couponCode, specialMessage } = await request.json();

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

    // Validar dirección de facturación — se manda directo a Stripe en el
    // payment_method_data del lado del cliente, pero igual la requerimos acá
    // para no crear un PaymentIntent para una orden que el cliente no va a
    // poder completar (el pago fallaría al confirmar sin esto).
    if (!billingAddress?.street || !billingAddress?.city || !billingAddress?.state || !billingAddress?.zip) {
      return NextResponse.json(
        { error: 'A complete billing address is required' },
        { status: 400 }
      );
    }

    // 🔒 VALIDAR CADA PRODUCTO CON STRAPI
    let validatedSubtotal = 0;
    const lineItemAmounts: number[] = []; // cents, parallel to compactItems — for Stripe Tax below
    const compactItems: CompactItem[] = await Promise.all(
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

          // boxFlavors is the fixed recipe for ONE box (already validated above to
          // sum to boxSize) — it is never the purchase quantity. The real quantity
          // (how many boxes/units) is always item.quantity, same as any other product.
          const validQuantity = Math.max(1, Math.min(100, item.quantity));
          validatedSubtotal += realPrice * validQuantity;
          lineItemAmounts.push(Math.round(realPrice * validQuantity * 100));

          // 🔒 Disponibilidad real (sin exponer cantidades de stock al cliente)
          const availableStock = strapiProduct.stock ?? 0;
          if (validQuantity > availableStock) {
            throw new Error('One or more items in your cart are currently unavailable. Please remove them and try again.');
          }

          return {
            id: strapiProduct.id,
            q: validQuantity,
            f: item.flavor,
            bf: boxFlavors,
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

    // 🔒 CUPÓN — validado contra la lista fija del servidor, nunca se confía en el % que mande el cliente
    let discountAmount = 0;
    let appliedCouponCode: string | undefined;
    if (couponCode) {
      const { valid, percentOff } = validateCoupon(couponCode);
      if (!valid) {
        return NextResponse.json({ error: 'That discount code is not valid.' }, { status: 400 });
      }
      discountAmount = Math.round(validatedSubtotal * (percentOff / 100) * 100) / 100;
      appliedCouponCode = couponCode.trim().toUpperCase();
    }

    // 🧾 STRIPE TAX — dormant until Tax is enabled on the Stripe dashboard (needs an
    // origin address + registered states/nexus configured there, a business decision,
    // not a code one). Until then this call fails and we fail open at $0 tax so
    // checkout keeps working exactly as it does today; the moment Tax is turned on,
    // this starts calculating for real with no further code changes needed.
    // NOTE: tax is calculated on pre-discount line amounts — worth revisiting once Tax is live.
    let taxAmount = 0;
    let taxCalculationId: string | undefined;
    try {
      // Shipping/Delivery already have a real destination address; Pickup has
      // no delivery destination at all, so the billing address (now always
      // collected at checkout) is the address of record for tax purposes there.
      const taxAddress =
        deliveryInfo.type === 'shipping'
          ? {
              line1: shippingAddress?.street || '',
              city: shippingAddress?.city || '',
              state: shippingAddress?.state || '',
              postal_code: shippingAddress?.zip || '',
              country: 'US',
            }
          : deliveryInfo.type === 'pickup'
          ? {
              line1: billingAddress?.street || '',
              city: billingAddress?.city || '',
              state: billingAddress?.state || '',
              postal_code: billingAddress?.zip || '',
              country: 'US',
            }
          : { line1: deliveryInfo.address || '', country: 'US' };
      const taxAddressSource = deliveryInfo.type === 'pickup' ? 'billing' : 'shipping';

      const taxLineItems = lineItemAmounts.map((amount, i) => ({
        amount,
        reference: `item_${i}`,
        tax_code: FOOD_TAX_CODE,
      }));

      const calculation = await stripe.tax.calculations.create({
        currency: 'usd',
        line_items: taxLineItems,
        // Shipping/delivery charges have their own dedicated param — Stripe
        // rejects a shipping tax_code passed as a regular line item.
        ...(validatedDeliveryFee > 0
          ? { shipping_cost: { amount: Math.round(validatedDeliveryFee * 100), tax_code: SHIPPING_TAX_CODE } }
          : {}),
        customer_details: { address: taxAddress, address_source: taxAddressSource },
      });

      taxAmount = calculation.tax_amount_exclusive / 100;
      taxCalculationId = calculation.id ?? undefined;
    } catch (error) {
      console.warn('Stripe Tax calculation skipped (likely not enabled yet):', error);
      taxAmount = 0;
    }

    const processingFee = calculateProcessingFee(validatedSubtotal - discountAmount + validatedDeliveryFee + taxAmount);
    const total = validatedSubtotal - discountAmount + validatedDeliveryFee + taxAmount + processingFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        customerEmail: customerInfo.email,
        couponCode: appliedCouponCode || '',
        deliveryType: deliveryInfo.type,
        deliveryDate: deliveryInfo.date || '',
        deliveryTime: deliveryInfo.time || '',
        deliveryAddress: deliveryInfo.address || '',
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : '',
        subtotal: validatedSubtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        deliveryFee: validatedDeliveryFee.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        taxCalculationId: taxCalculationId || '',
        processingFee: processingFee.toFixed(2),
        specialMessage: typeof specialMessage === 'string' ? specialMessage.slice(0, 300) : '',
        ...chunkMetadata('items', JSON.stringify(compactItems)), // 🔒 ITEMS CON PRECIOS VALIDADOS (re-fetched from Strapi by the webhook)
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      breakdown: {
        subtotal: validatedSubtotal,
        discountAmount,
        deliveryFee: validatedDeliveryFee,
        taxAmount,
        processingFee,
        total,
      },
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);

    // Proporcionar mensaje de error más específico al usuario
    const errorMessage = error.message || 'Unable to process checkout';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
