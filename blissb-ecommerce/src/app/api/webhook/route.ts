import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Temporarily disable Resend until we configure it
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing successful payment:', session.id);

    // Get line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    });

    // Extract order information
    const orderInfo = {
      sessionId: session.id,
      orderNumber: `BLISS-${session.id.slice(-8).toUpperCase()}`,
      customerEmail: session.customer_email || session.customer_details?.email,
      customerName: session.metadata?.customerName || session.customer_details?.name,
      customerPhone: session.metadata?.customerPhone || session.customer_details?.phone,
      deliveryType: session.metadata?.deliveryType,
      deliveryDate: session.metadata?.deliveryDate,
      deliveryTime: session.metadata?.deliveryTime,
      deliveryAddress: session.metadata?.deliveryAddress,
      zipCode: session.metadata?.zipCode,
      totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase(),
      items: lineItems.data.map(item => ({
        name: item.description || 'Unknown Product',
        quantity: item.quantity,
        amount: item.amount_total ? item.amount_total / 100 : 0
      })),
      paymentStatus: session.payment_status,
      createdAt: new Date(session.created * 1000)
    };

    // Send email notification
    await sendOrderNotification(orderInfo);

    console.log('Order processed successfully:', orderInfo.orderNumber);
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function sendOrderNotification(orderInfo: any) {
  try {
    const emailContent = formatOrderEmail(orderInfo);

    // Only send email if Resend is configured
    if (resend) {
      // Send email to business owner
      const emailResult = await resend.emails.send({
        from: 'Bliss-B Desserts <onboarding@resend.dev>', // Use Resend's default domain for testing
        to: 'blissbdesserts@gmail.com',
        subject: `🎉 Nueva Orden - ${orderInfo.orderNumber}`,
        text: emailContent,
        html: formatOrderEmailHTML(orderInfo),
      });

      console.log('Email sent successfully:', emailResult);

      // Optional: Send confirmation email to customer
      if (orderInfo.customerEmail) {
        await resend.emails.send({
          from: 'Bliss-B Desserts <onboarding@resend.dev>',
          to: orderInfo.customerEmail,
          subject: `Order Confirmation - ${orderInfo.orderNumber}`,
          text: formatCustomerConfirmationEmail(orderInfo),
          html: formatCustomerConfirmationEmailHTML(orderInfo),
        });
      }
    } else {
      // Log order info to console if email service not configured
      console.log('ORDER RECEIVED (Email service not configured):', emailContent);
    }

  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

function formatOrderEmail(orderInfo: any) {
  const deliverySection = () => {
    switch (orderInfo.deliveryType) {
      case 'pickup':
        return `
🏪 PICKUP
📅 Fecha: ${orderInfo.deliveryDate} at ${orderInfo.deliveryTime}
📍 Ubicación: 123 Sweet Street, Atlanta, GA 30309
⚠️  Cliente debe traer ID válido
        `;
      case 'delivery':
        return `
🚚 DELIVERY
📅 Fecha: ${orderInfo.deliveryDate} at ${orderInfo.deliveryTime}
📍 Dirección: ${orderInfo.deliveryAddress}
📮 ZIP: ${orderInfo.zipCode}
        `;
      case 'shipping':
        return `
📦 SHIPPING
📍 Dirección: ${orderInfo.deliveryAddress}
📮 ZIP: ${orderInfo.zipCode}
⏱️  Tiempo estimado: 3-5 días hábiles
        `;
      default:
        return '❓ Método de entrega no especificado';
    }
  };

  return `
🎉 NUEVA ORDEN BLISS-B

📋 ORDEN: ${orderInfo.orderNumber}
💳 Total: $${orderInfo.totalAmount} ${orderInfo.currency}
📅 Fecha: ${orderInfo.createdAt.toLocaleString()}

👤 CLIENTE:
   Nombre: ${orderInfo.customerName || 'No especificado'}
   Email: ${orderInfo.customerEmail || 'No especificado'}
   Teléfono: ${orderInfo.customerPhone || 'No especificado'}

🛍️ PRODUCTOS:
${orderInfo.items.map((item: any) =>
  `   • ${item.quantity}x ${item.name} - $${item.amount}`
).join('\n')}

${deliverySection()}

💳 Estado del Pago: ${orderInfo.paymentStatus}
🔗 Ver en Stripe: https://dashboard.stripe.com/payments/${orderInfo.sessionId}

---
Bliss-B Desserts 🍪
  `;
}

function formatOrderEmailHTML(orderInfo: any) {
  const deliverySection = () => {
    switch (orderInfo.deliveryType) {
      case 'pickup':
        return `
        <div style="background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #1E7A31; margin: 0 0 10px 0;">🏪 PICKUP</h3>
          <p><strong>Fecha:</strong> ${orderInfo.deliveryDate} at ${orderInfo.deliveryTime}</p>
          <p><strong>Ubicación:</strong> 123 Sweet Street, Atlanta, GA 30309</p>
          <p style="color: #e67e22;"><strong>⚠️ Cliente debe traer ID válido</strong></p>
        </div>
        `;
      case 'delivery':
        return `
        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #2980b9; margin: 0 0 10px 0;">🚚 DELIVERY</h3>
          <p><strong>Fecha:</strong> ${orderInfo.deliveryDate} at ${orderInfo.deliveryTime}</p>
          <p><strong>Dirección:</strong> ${orderInfo.deliveryAddress}</p>
          <p><strong>ZIP:</strong> ${orderInfo.zipCode}</p>
        </div>
        `;
      case 'shipping':
        return `
        <div style="background: #f8f4e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #d68910; margin: 0 0 10px 0;">📦 SHIPPING</h3>
          <p><strong>Dirección:</strong> ${orderInfo.deliveryAddress}</p>
          <p><strong>ZIP:</strong> ${orderInfo.zipCode}</p>
          <p><strong>Tiempo estimado:</strong> 3-5 días hábiles</p>
        </div>
        `;
      default:
        return '<p>❓ Método de entrega no especificado</p>';
    }
  };

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: #8F4B2B; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🎉 Nueva Orden Bliss-B</h1>
    </div>

    <div style="padding: 20px;">
      <div style="background: #f8f4f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #8F4B2B; margin: 0 0 10px 0;">📋 ${orderInfo.orderNumber}</h2>
        <p style="font-size: 18px; color: #1E7A31; font-weight: bold; margin: 5px 0;">💳 Total: $${orderInfo.totalAmount} ${orderInfo.currency}</p>
        <p style="color: #666; margin: 5px 0;">📅 ${orderInfo.createdAt.toLocaleString()}</p>
      </div>

      <h3 style="color: #8F4B2B;">👤 CLIENTE</h3>
      <ul style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
        <li><strong>Nombre:</strong> ${orderInfo.customerName || 'No especificado'}</li>
        <li><strong>Email:</strong> ${orderInfo.customerEmail || 'No especificado'}</li>
        <li><strong>Teléfono:</strong> ${orderInfo.customerPhone || 'No especificado'}</li>
      </ul>

      <h3 style="color: #8F4B2B;">🛍️ PRODUCTOS</h3>
      <ul style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
        ${orderInfo.items.map((item: any) =>
          `<li><strong>${item.quantity}x</strong> ${item.name} - <span style="color: #1E7A31;">$${item.amount}</span></li>`
        ).join('')}
      </ul>

      ${deliverySection()}

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://dashboard.stripe.com/payments/${orderInfo.sessionId}"
           style="background: #8F4B2B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Ver en Stripe Dashboard
        </a>
      </div>
    </div>

    <div style="background: #f8f4f0; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
      <p style="margin: 0; color: #666;">Bliss-B Desserts 🍪</p>
    </div>
  </div>
  `;
}

function formatCustomerConfirmationEmail(orderInfo: any) {
  return `
¡Gracias por tu orden!

Tu pedido ${orderInfo.orderNumber} ha sido confirmado.

Resumen de tu orden:
${orderInfo.items.map((item: any) =>
  `• ${item.quantity}x ${item.name} - $${item.amount}`
).join('\n')}

Total: $${orderInfo.totalAmount}

Te contactaremos pronto con actualizaciones sobre tu orden.

¡Gracias por elegir Bliss-B Desserts! 🍪
  `;
}

function formatCustomerConfirmationEmailHTML(orderInfo: any) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #8F4B2B;">¡Gracias por tu orden!</h1>
    <p>Tu pedido <strong>${orderInfo.orderNumber}</strong> ha sido confirmado.</p>

    <h3>Resumen de tu orden:</h3>
    <ul>
      ${orderInfo.items.map((item: any) =>
        `<li>${item.quantity}x ${item.name} - $${item.amount}</li>`
      ).join('')}
    </ul>

    <p style="font-size: 18px; color: #1E7A31;"><strong>Total: $${orderInfo.totalAmount}</strong></p>

    <p>Te contactaremos pronto con actualizaciones sobre tu orden.</p>
    <p>¡Gracias por elegir Bliss-B Desserts! 🍪</p>
  </div>
  `;
}