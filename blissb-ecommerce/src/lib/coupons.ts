// Minimal, intentionally small coupon system: one fixed welcome code tied to the
// newsletter signup modal. Not a general coupon-management panel (that's the larger,
// not-yet-built Fase 2.3 scope) — just enough to make the modal's discount real.
const COUPONS: Record<string, { percentOff: number }> = {
  WELCOME5: { percentOff: 5 },
};

export type CouponResult = { valid: boolean; percentOff: number };

export function validateCoupon(code: string): CouponResult {
  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS[normalized];
  return coupon ? { valid: true, percentOff: coupon.percentOff } : { valid: false, percentOff: 0 };
}

export function applyCouponDiscount(subtotal: number, code: string): number {
  const { valid, percentOff } = validateCoupon(code);
  if (!valid) return 0;
  return Math.round(subtotal * (percentOff / 100) * 100) / 100;
}
