const PROCESSING_FEE_RATE = 0.029;
const PROCESSING_FEE_FIXED = 0.80;

export function calculateProcessingFee(amount: number): number {
  if (amount <= 0) return 0;

  return Math.round((amount * PROCESSING_FEE_RATE + PROCESSING_FEE_FIXED) * 100) / 100;
}
