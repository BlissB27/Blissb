import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

// Coupon validation for the cart/checkout "Apply" buttons. Runs server-side so
// the coupon list (and the Strapi token) never reach the browser — the client
// only ever learns whether the single code it typed is valid, and its %.
export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ valid: false, percentOff: 0, error: 'Enter a discount code.' }, { status: 200 });
    }

    const parsedSubtotal = typeof subtotal === 'number' && Number.isFinite(subtotal) ? subtotal : undefined;
    const result = await validateCoupon(code, parsedSubtotal);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, percentOff: 0, error: "Couldn't check that code right now. Please try again." },
      { status: 200 }
    );
  }
}
