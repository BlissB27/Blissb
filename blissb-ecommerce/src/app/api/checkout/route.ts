import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductByIdAsync } from '@/data/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Configuración de delivery zones (debe coincidir con deliveryStore.ts)
const FREE_DELIVERY_ZIP_CODES = [
  '30517', '30548', '30519', '30542', '30011', '30507',
  '30522', '30563', '30537', '30601', '30512', '30534',
  '30043', '30518', '30024'
];
const STANDARD_DELIVERY_FEE = 20;
const SHIPPING_COST = 15;

// Función para validar delivery fee
function validateDeliveryFee(type: string, zipCode: string): number {
  if (type === 'pickup') return 0;
  if (type === 'shipping') return SHIPPING_COST;
  if (type === 'delivery') {
    return FREE_DELIVERY_ZIP_CODES.includes(zipCode) ? 0 : STANDARD_DELIVERY_FEE;
  }
  return 0;
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, deliveryInfo } = await request.json();

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

          // Validar cantidad (entre 1 y 100)
          const validQuantity = Math.max(1, Math.min(100, item.quantity));

          if (validQuantity !== item.quantity) {
            console.warn(`Quantity adjusted for ${item.product.id}: ${item.quantity} -> ${validQuantity}`);
          }

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: strapiProduct.name,
                description: item.flavor ? `Flavor: ${item.flavor}` :
                           item.customMessage ? `Message: "${item.customMessage}"` : undefined,
                images: strapiProduct.image ? [strapiProduct.image] : [],
              },
              unit_amount: Math.round(realPrice * 100), // 🔒 PRECIO VALIDADO DE STRAPI
            },
            quantity: validQuantity,
          };
        } catch (error) {
          console.error(`Error validating product ${item.product.id}:`, error);
          throw new Error(`Unable to validate product: ${item.product.name}`);
        }
      })
    );

    // 🔒 VALIDAR DELIVERY FEE EN EL BACKEND
    const validatedDeliveryFee = validateDeliveryFee(
      deliveryInfo.type,
      deliveryInfo.zipCode || ''
    );

    // Verificar si el fee del frontend coincide con el calculado
    const frontendFee = deliveryInfo.fee || 0;
    if (Math.abs(validatedDeliveryFee - frontendFee) > 0.01) {
      console.warn('Delivery fee mismatch:', {
        frontend: frontendFee,
        validated: validatedDeliveryFee,
        type: deliveryInfo.type,
        zipCode: deliveryInfo.zipCode,
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
              : `Delivery to ${deliveryInfo.zipCode}`,
          },
          unit_amount: Math.round(validatedDeliveryFee * 100), // 🔒 FEE VALIDADO
        },
        quantity: 1,
      });
    }

    // Crear sesión de checkout de Stripe con items validados
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validatedLineItems, // 🔒 ITEMS CON PRECIOS VALIDADOS
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        deliveryType: deliveryInfo.type,
        deliveryDate: deliveryInfo.date || '',
        deliveryTime: deliveryInfo.time || '',
        deliveryAddress: deliveryInfo.address || '',
        zipCode: deliveryInfo.zipCode || '',
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