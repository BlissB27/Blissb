import { NextRequest, NextResponse } from 'next/server';
import { validateAndPriceItems } from '@/lib/orderValidation';
import { buildTaxAddress, calculateOrderTax } from '@/lib/stripeTax';

// Live tax preview as the customer fills out checkout, so the on-screen total
// (and the amount shown in the Payment Element / Apple Pay / Google Pay sheet)
// matches what /api/checkout actually charges when "Pay" is clicked. This is a
// preview only — /api/checkout always recomputes everything authoritatively
// again at payment time, so a stale or wrong preview here can't misprice an order.
export async function POST(request: NextRequest) {
  try {
    const { items, deliveryInfo, deliveryAddress, shippingAddress, billingAddress } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ taxAmount: 0 });
    }
    if (!billingAddress?.street || !billingAddress?.city || !billingAddress?.state || !billingAddress?.zip) {
      return NextResponse.json({ taxAmount: 0 });
    }

    const { lineItemAmounts } = await validateAndPriceItems(items);

    const { address, addressSource } = buildTaxAddress(
      deliveryInfo?.type ?? 'pickup',
      deliveryAddress,
      shippingAddress,
      billingAddress
    );

    const { taxAmount, taxCalculationId } = await calculateOrderTax({
      lineItemAmounts,
      deliveryFeeCents: Math.round((deliveryInfo?.fee ?? 0) * 100),
      address,
      addressSource,
    });

    return NextResponse.json({ taxAmount, taxCalculationId });
  } catch (error) {
    console.error('Error computing tax quote:', error);
    // Best-effort preview — fail open at $0 rather than blocking the checkout UI.
    return NextResponse.json({ taxAmount: 0 });
  }
}
