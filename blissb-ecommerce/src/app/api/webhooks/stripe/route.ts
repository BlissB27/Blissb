import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, unchunkMetadata } from '@/lib/stripe';
import { sendOrderEmails } from '@/lib/email';
import { getProductByIdAsync } from '@/data/products';
import { decrementProductStock } from '@/services/products';
import { toSentenceCase } from '@/lib/text';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

type CompactItem = {
  id: string;
  q: number;
  f?: string;
  bf?: { flavor: string; quantity: number }[];
  m?: string; // Mensaje corto en chocolate (solo cakes)
};

// Deterministic numeric id for the email template's `Product.id` field — it's
// only used for display/keying in the email, not a real business identifier,
// so a stable hash of the real (string) product id is enough.
function hashToNumericId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

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

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata || {};

      // Un PaymentIntent no trae line_items como una Checkout Session — el
      // carrito viaja comprimido en metadata (ver chunkMetadata en lib/stripe.ts)
      // y se re-valida contra Strapi acá, en vez de confiar en lo que mandó el cliente.
      let compactItems: CompactItem[] = [];
      try {
        compactItems = JSON.parse(unchunkMetadata('items', metadata));
      } catch (err) {
        console.error('Failed to parse items from PaymentIntent metadata:', err);
      }

      const products = (
        await Promise.all(
          compactItems.map(async (item) => {
            const product = await getProductByIdAsync(item.id);
            if (!product) {
              console.error(`Product not found while fulfilling order: ${item.id}`);
              return null;
            }

            const size = item.bf?.length
              ? item.bf.map((f) => toSentenceCase(f.flavor)).join(', ')
              : item.f
              ? toSentenceCase(item.f)
              : undefined;

            return {
              id: hashToNumericId(item.id),
              productId: item.id,
              name: product.name,
              price: product.price,
              quantity: item.q,
              image: product.image,
              size,
              message: item.m,
            };
          })
        )
      ).filter((p): p is NonNullable<typeof p> => p !== null);

      // Descontar inventario (best-effort, no debe fallar el webhook si algo sale mal)
      for (const p of products) {
        await decrementProductStock(p.productId, p.quantity).catch((err) =>
          console.error(`Failed to decrement stock for product ${p.productId}:`, err)
        );
      }

      const subtotal = Number(metadata.subtotal || 0);
      const shipping = Number(metadata.deliveryFee || 0);
      const processingFee = Number(metadata.processingFee || 0);
      const total = paymentIntent.amount / 100;

      // Dirección: la del PaymentIntent (si el cliente la mandó vía confirmParams.shipping
      // para delivery/shipping), si no la estructurada que guardamos en metadata para
      // "shipping", si no la dirección de texto libre de "delivery".
      const stripeAddress = paymentIntent.shipping?.address;
      let shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone?: string;
      };

      if (stripeAddress) {
        shippingAddress = {
          street: stripeAddress.line1 || '',
          city: stripeAddress.city || '',
          state: stripeAddress.state || '',
          zipCode: stripeAddress.postal_code || '',
          country: stripeAddress.country || 'US',
          phone: metadata.customerPhone,
        };
      } else if (metadata.shippingAddress) {
        try {
          const parsed = JSON.parse(metadata.shippingAddress);
          shippingAddress = {
            street: parsed.street || '',
            city: parsed.city || '',
            state: parsed.state || '',
            zipCode: parsed.zip || '',
            country: 'US',
            phone: metadata.customerPhone,
          };
        } catch {
          shippingAddress = { street: '', city: '', state: '', zipCode: '', country: 'US', phone: metadata.customerPhone };
        }
      } else {
        shippingAddress = {
          street: metadata.deliveryAddress || '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US',
          phone: metadata.customerPhone,
        };
      }

      const orderNumber = `BLISS-${paymentIntent.id.slice(-8).toUpperCase()}`;
      const orderDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const emailResult = await sendOrderEmails({
        customerName: metadata.customerName || 'Cliente',
        customerEmail: paymentIntent.receipt_email || metadata.customerEmail || '',
        orderNumber,
        orderDate,
        products,
        subtotal,
        shipping,
        processingFee,
        total,
        shippingAddress,
        paymentMethod: 'Stripe',
        paymentId: paymentIntent.id,
        deliveryType: metadata.deliveryType || '',
        deliveryDate: metadata.deliveryDate || '',
        deliveryTime: metadata.deliveryTime || '',
        specialMessage: metadata.specialMessage || '',
      });

      console.log('Email results:', emailResult);

      if (!emailResult.customer.success) {
        console.error('Failed to send customer email:', emailResult.customer.error);
      }

      if (!emailResult.admin.success) {
        console.error('Failed to send admin email:', emailResult.admin.error);
      }

      // 🧾 Stripe Tax — records the transaction for reporting/remittance. Only
      // runs when /api/checkout actually got a calculation (i.e. Tax is enabled
      // on the account); best-effort, must never fail order fulfillment.
      if (metadata.taxCalculationId) {
        await stripe.tax.transactions
          .createFromCalculation({ calculation: metadata.taxCalculationId, reference: orderNumber })
          .catch((err) => console.error('Failed to record Stripe Tax transaction:', err));
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
