import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, deliveryInfo } = await request.json();

    // Calcular el total basado en los items y el delivery
    const itemsTotal = items.reduce((sum: number, item: any) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const deliveryFee = deliveryInfo.fee || 0;
    const total = itemsTotal + deliveryFee;

    // Crear líneas de items para Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.flavor ? `Flavor: ${item.flavor}` : undefined,
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // Convertir a centavos
      },
      quantity: item.quantity,
    }));

    // Agregar delivery fee como línea separada si existe
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: deliveryInfo.type === 'shipping' ? 'Shipping' : 'Delivery Fee',
            description: deliveryInfo.type === 'shipping'
              ? 'Nationwide shipping'
              : `Delivery to ${deliveryInfo.zipCode}`,
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
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
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}