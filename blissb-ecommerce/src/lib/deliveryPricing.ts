export const MAX_DELIVERY_MILES = 25;
export const FREE_DELIVERY_SUBTOTAL_THRESHOLD = 60;
// Envío (UPS) gratis a partir de este subtotal. Fuente de verdad única, usada
// tanto en el front (carrito/checkout) como en la re-validación del backend.
export const FREE_SHIPPING_SUBTOTAL_THRESHOLD = 65;

export type DeliveryQuote = {
  eligible: boolean;
  fee: number;
  miles: number;
};

/**
 * Confirmed mileage-based delivery pricing tiers (client proposal, Fase 2 / section 2.1):
 * 0–7 mi free, 7.1–12 mi $7, 12.1–17 mi $10, 17.1–25 mi $15.
 * Free regardless of distance on any order $60+ subtotal, as long as it's within the 25-mile radius.
 * Beyond 25 miles, delivery isn't offered at all.
 */
export function getDeliveryQuote(miles: number, subtotal: number): DeliveryQuote {
  if (miles > MAX_DELIVERY_MILES) {
    return { eligible: false, fee: 0, miles };
  }

  if (subtotal >= FREE_DELIVERY_SUBTOTAL_THRESHOLD) {
    return { eligible: true, fee: 0, miles };
  }

  let fee: number;
  if (miles <= 7) {
    fee = 0;
  } else if (miles <= 12) {
    fee = 7;
  } else if (miles <= 17) {
    fee = 10;
  } else {
    fee = 15;
  }

  return { eligible: true, fee, miles };
}
