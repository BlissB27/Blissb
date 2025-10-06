import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderEmails } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verificar el evento del webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // Manejar evento de checkout completado
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Obtener los detalles de la sesión
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items.data.price.product'],
        }
      );

      const lineItems = sessionWithLineItems.line_items?.data || [];
      const metadata = session.metadata || {};

      // Preparar datos para los emails
      const products = lineItems
        .filter((item) => {
          const productData = item.price?.product as Stripe.Product | null;
          return productData?.name !== 'Shipping' && productData?.name !== 'Delivery Fee';
        })
        .map((item) => {
          const productData = item.price?.product as Stripe.Product;
          return {
            id: parseInt(item.id.slice(-8), 16), // Generar ID numérico
            name: productData.name,
            price: (item.amount_total || 0) / 100 / (item.quantity || 1),
            quantity: item.quantity || 1,
            image: productData.images?.[0],
            size: item.description?.includes('Flavor:')
              ? item.description.split('Flavor: ')[1]
              : undefined,
          };
        });

      // Calcular totales
      const shippingItem = lineItems.find((item) => {
        const productData = item.price?.product as Stripe.Product | null;
        return (
          productData?.name === 'Shipping' ||
          productData?.name === 'Delivery Fee'
        );
      });

      const shipping = shippingItem ? (shippingItem.amount_total || 0) / 100 : 0;
      const subtotal = products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );
      const total = (session.amount_total || 0) / 100;

      // Obtener dirección de envío
      const shippingDetails = session.shipping_details || session.shipping;
      const shippingAddress = {
        street: shippingDetails?.address?.line1 || metadata.deliveryAddress || '',
        city: shippingDetails?.address?.city || '',
        state: shippingDetails?.address?.state || '',
        zipCode: shippingDetails?.address?.postal_code || metadata.zipCode || '',
        country: shippingDetails?.address?.country || 'US',
        phone: shippingDetails?.phone || metadata.customerPhone,
      };

      const orderNumber = `BLISS-${session.id.slice(-8).toUpperCase()}`;
      const orderDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Enviar emails
      const emailResult = await sendOrderEmails({
        customerName: metadata.customerName || shippingDetails?.name || 'Cliente',
        customerEmail: session.customer_details?.email || session.customer_email || '',
        orderNumber,
        orderDate,
        products,
        subtotal,
        shipping,
        total,
        shippingAddress,
        paymentMethod: 'Stripe',
        paymentId: session.payment_intent as string,
      });

      console.log('Email results:', emailResult);

      if (!emailResult.customer.success) {
        console.error('Failed to send customer email:', emailResult.customer.error);
      }

      if (!emailResult.admin.success) {
        console.error('Failed to send admin email:', emailResult.admin.error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
