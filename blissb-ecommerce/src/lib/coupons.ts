import { strapiGet } from '@/lib/strapi';

// Coupons live in Strapi (colección "Coupon") so the client can create/edit/
// deactivate them from the admin without a code change. This module only runs
// server-side (it uses the Strapi API token): the checkout route and the
// /api/validate-coupon endpoint call it — never a client component directly.
export type CouponResult = { valid: boolean; percentOff: number; error?: string };

const INVALID = (error: string): CouponResult => ({ valid: false, percentOff: 0, error });

/**
 * Validates a code against Strapi. Pass `subtotal` when it's known (checkout /
 * apply) so the minimum-subtotal rule can be enforced; omit it to only check
 * existence/active/expiry.
 */
export async function validateCoupon(code: string, subtotal?: number): Promise<CouponResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return INVALID('Enter a discount code.');

  let coupon: any;
  try {
    // $eqi = case-insensitive, so "welcome5" matches "WELCOME5" in Strapi.
    const res: any = await strapiGet('/coupons', { 'filters[code][$eqi]': normalized });
    coupon = Array.isArray(res?.data) ? res.data[0] : undefined;
  } catch {
    return INVALID("Couldn't check that code right now. Please try again.");
  }

  if (!coupon) return INVALID("That discount code isn't valid.");

  // Strapi v5: fields sit directly on the entry (no `attributes` wrapper).
  const percentOff = Number(coupon.percentOff) || 0;
  const isActive = coupon.active !== false;
  const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
  const minSubtotal = Number(coupon.minSubtotal) || 0;

  if (!isActive) return INVALID("That discount code isn't active.");
  if (percentOff < 1) return INVALID("That discount code isn't valid.");
  if (expiresAt && expiresAt.getTime() < Date.now()) return INVALID('That discount code has expired.');
  if (subtotal !== undefined && minSubtotal > 0 && subtotal < minSubtotal) {
    return INVALID(`This code needs a subtotal of at least $${minSubtotal.toFixed(2)}.`);
  }

  return { valid: true, percentOff };
}
