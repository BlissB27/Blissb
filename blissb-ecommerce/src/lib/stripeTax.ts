import { stripe } from '@/lib/stripe';

// Verified directly against Stripe's live tax-codes API (not the account's
// default, which was "Electronically Supplied Services" — wrong for a
// bakery). Set explicitly per line item rather than relying on the Dashboard
// default, per Stripe's own recommendation, so a later unrelated change to
// the account default can't silently drift tax collection.
const FOOD_TAX_CODE = 'txcd_40040000'; // Food for Non-Immediate Consumption — off-premises pickup/delivery/shipping, which is all we do
const SHIPPING_TAX_CODE = 'txcd_92010001'; // Shipping

export type TaxAddress = { line1: string; city?: string; state?: string; postal_code?: string; country: string };

type AddressLike = { street?: string; city?: string; state?: string; zip?: string } | undefined;

// Shipping/Delivery already have a real destination address; Pickup has no
// delivery destination at all, so the billing address (always collected at
// checkout) is the address of record for tax purposes there.
//
// All three branches need the *structured* address (city/state/zip as
// separate fields) — Stripe Tax rejects a US address with no `postal_code`,
// which a single joined address line (e.g. "123 Main St, Braselton, GA
// 30517") can't provide on its own.
export function buildTaxAddress(
  deliveryType: string,
  deliveryAddress: AddressLike,
  shippingAddress: AddressLike,
  billingAddress: AddressLike
): { address: TaxAddress; addressSource: 'billing' | 'shipping' } {
  if (deliveryType === 'shipping') {
    return {
      address: {
        line1: shippingAddress?.street || '',
        city: shippingAddress?.city || '',
        state: shippingAddress?.state || '',
        postal_code: shippingAddress?.zip || '',
        country: 'US',
      },
      addressSource: 'shipping',
    };
  }
  if (deliveryType === 'delivery') {
    return {
      address: {
        line1: deliveryAddress?.street || '',
        city: deliveryAddress?.city || '',
        state: deliveryAddress?.state || '',
        postal_code: deliveryAddress?.zip || '',
        country: 'US',
      },
      addressSource: 'shipping',
    };
  }
  return {
    address: {
      line1: billingAddress?.street || '',
      city: billingAddress?.city || '',
      state: billingAddress?.state || '',
      postal_code: billingAddress?.zip || '',
      country: 'US',
    },
    addressSource: 'billing',
  };
}

// 🧾 STRIPE TAX — fails open at $0 tax (rather than blocking checkout) if Tax
// isn't enabled on the Stripe dashboard yet, or the calculation otherwise errors.
// NOTE: tax is calculated on pre-discount line amounts — worth revisiting once Tax is live.
export async function calculateOrderTax(params: {
  lineItemAmounts: number[]; // cents
  deliveryFeeCents: number;
  address: TaxAddress;
  addressSource: 'billing' | 'shipping';
}): Promise<{ taxAmount: number; taxCalculationId?: string }> {
  try {
    const taxLineItems = params.lineItemAmounts.map((amount, i) => ({
      amount,
      reference: `item_${i}`,
      tax_code: FOOD_TAX_CODE,
    }));

    const calculation = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: taxLineItems,
      // Shipping/delivery charges have their own dedicated param — Stripe
      // rejects a shipping tax_code passed as a regular line item.
      ...(params.deliveryFeeCents > 0
        ? { shipping_cost: { amount: params.deliveryFeeCents, tax_code: SHIPPING_TAX_CODE } }
        : {}),
      customer_details: { address: params.address, address_source: params.addressSource },
    });

    return { taxAmount: calculation.tax_amount_exclusive / 100, taxCalculationId: calculation.id ?? undefined };
  } catch (error) {
    console.warn('Stripe Tax calculation skipped (likely not enabled yet, or address incomplete):', error);
    return { taxAmount: 0, taxCalculationId: undefined };
  }
}
