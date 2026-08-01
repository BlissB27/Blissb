import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance (para API routes)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
  appInfo: {
    name: 'Bliss-B Desserts',
    version: '1.0.0',
  },
});

// Client-side Stripe instance (para el frontend)
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// PaymentIntent metadata values cap at 500 chars each. A Checkout Session's
// line_items carry the cart automatically; a PaymentIntent doesn't, so we
// stash a compact cart snapshot in metadata ourselves — chunked across
// `${key}_0`, `${key}_1`, ... so one big cart doesn't silently get truncated.
const METADATA_CHUNK_SIZE = 450;

export function chunkMetadata(key: string, value: string): Record<string, string> {
  const chunks: Record<string, string> = {};
  for (let i = 0; i * METADATA_CHUNK_SIZE < value.length; i++) {
    chunks[`${key}_${i}`] = value.slice(i * METADATA_CHUNK_SIZE, (i + 1) * METADATA_CHUNK_SIZE);
  }
  return chunks;
}

export function unchunkMetadata(key: string, metadata: Record<string, string>): string {
  let result = '';
  for (let i = 0; metadata[`${key}_${i}`] !== undefined; i++) {
    result += metadata[`${key}_${i}`];
  }
  return result;
}