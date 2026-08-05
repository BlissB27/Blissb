import { NextRequest, NextResponse } from 'next/server';
import { stripe, chunkMetadata } from '@/lib/stripe';
import { calculateProcessingFee } from '@/lib/orderFees';
import { getDrivingMilesFromOrigin } from '@/lib/googleMaps';
import { getDeliveryQuote } from '@/lib/deliveryPricing';
import { validateCoupon } from '@/lib/coupons';
import { validateAndPriceItems } from '@/lib/orderValidation';
import { buildTaxAddress, calculateOrderTax } from '@/lib/stripeTax';

const SHIPPING_COST = 15;

// Re-validates delivery fee server-side — the client's mileage-based quote is never trusted
// on its own, same principle already applied to product price/stock.
async function validateDeliveryFee(
  type: string,
  address: string,
  subtotal: number
): Promise<{ fee: number; eligible: boolean }> {
  if (type === 'pickup') return { fee: 0, eligible: true };
  if (type === 'shipping') return { fee: SHIPPING_COST, eligible: true };
  if (type === 'delivery') {
    const miles = await getDrivingMilesFromOrigin(address);
    return getDeliveryQuote(miles, subtotal);
  }
  return { fee: 0, eligible: true };
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, deliveryInfo, deliveryAddress, shippingAddress, billingAddress, couponCode, specialMessage } = await request.json();

    // Validar que haya items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validar información del cliente
    if (!customerInfo?.email || !customerInfo?.name) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Validar dirección de facturación — se manda directo a Stripe en el
    // payment_method_data del lado del cliente, pero igual la requerimos acá
    // para no crear un PaymentIntent para una orden que el cliente no va a
    // poder completar (el pago fallaría al confirmar sin esto).
    if (!billingAddress?.street || !billingAddress?.city || !billingAddress?.state || !billingAddress?.zip) {
      return NextResponse.json(
        { error: 'A complete billing address is required' },
        { status: 400 }
      );
    }

    // 🔒 VALIDAR CADA PRODUCTO CON STRAPI
    const { validatedSubtotal, lineItemAmounts, compactItems } = await validateAndPriceItems(items);

    // 🔒 MÍNIMO DE ORDEN
    if (validatedSubtotal < 20) {
      return NextResponse.json(
        { error: 'Your cart subtotal must be at least $20 to check out.' },
        { status: 400 }
      );
    }

    // 🔒 VALIDAR DELIVERY FEE EN EL BACKEND (millas reales vía Google Maps para delivery)
    let validatedDeliveryFee: number;
    try {
      const quote = await validateDeliveryFee(
        deliveryInfo.type,
        deliveryInfo.address || '',
        validatedSubtotal
      );
      if (!quote.eligible) {
        return NextResponse.json(
          { error: 'This address is outside our 25-mile delivery radius. Please choose shipping or in-store pickup instead.' },
          { status: 400 }
        );
      }
      validatedDeliveryFee = quote.fee;
    } catch (error) {
      console.error('Error validating delivery fee:', error);
      return NextResponse.json(
        { error: 'Could not calculate delivery for this address. Please double-check it or choose shipping/pickup instead.' },
        { status: 400 }
      );
    }

    // Verificar si el fee del frontend coincide con el calculado
    const frontendFee = deliveryInfo.fee || 0;
    if (Math.abs(validatedDeliveryFee - frontendFee) > 0.01) {
      console.warn('Delivery fee mismatch:', {
        frontend: frontendFee,
        validated: validatedDeliveryFee,
        type: deliveryInfo.type,
        address: deliveryInfo.address,
      });
      // Usar el fee validado del backend
    }

    // 🔒 CUPÓN — validado contra la lista fija del servidor, nunca se confía en el % que mande el cliente
    let discountAmount = 0;
    let appliedCouponCode: string | undefined;
    if (couponCode) {
      const { valid, percentOff } = validateCoupon(couponCode);
      if (!valid) {
        return NextResponse.json({ error: 'That discount code is not valid.' }, { status: 400 });
      }
      discountAmount = Math.round(validatedSubtotal * (percentOff / 100) * 100) / 100;
      appliedCouponCode = couponCode.trim().toUpperCase();
    }

    // 🧾 STRIPE TAX — see lib/stripeTax.ts. Fails open at $0 if Tax isn't
    // enabled on the dashboard yet; the client previews this same number via
    // /api/tax-quote so the on-screen total matches what gets charged here.
    const { address: taxAddress, addressSource: taxAddressSource } = buildTaxAddress(
      deliveryInfo.type,
      deliveryAddress,
      shippingAddress,
      billingAddress
    );
    const { taxAmount, taxCalculationId } = await calculateOrderTax({
      lineItemAmounts,
      deliveryFeeCents: Math.round(validatedDeliveryFee * 100),
      address: taxAddress,
      addressSource: taxAddressSource,
    });

    const processingFee = calculateProcessingFee(validatedSubtotal - discountAmount + validatedDeliveryFee + taxAmount);
    const total = validatedSubtotal - discountAmount + validatedDeliveryFee + taxAmount + processingFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        customerEmail: customerInfo.email,
        couponCode: appliedCouponCode || '',
        deliveryType: deliveryInfo.type,
        deliveryDate: deliveryInfo.date || '',
        deliveryTime: deliveryInfo.time || '',
        deliveryAddress: deliveryInfo.address || '',
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : '',
        subtotal: validatedSubtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        deliveryFee: validatedDeliveryFee.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        taxCalculationId: taxCalculationId || '',
        processingFee: processingFee.toFixed(2),
        specialMessage: typeof specialMessage === 'string' ? specialMessage.slice(0, 300) : '',
        ...chunkMetadata('items', JSON.stringify(compactItems)), // 🔒 ITEMS CON PRECIOS VALIDADOS (re-fetched from Strapi by the webhook)
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      breakdown: {
        subtotal: validatedSubtotal,
        discountAmount,
        deliveryFee: validatedDeliveryFee,
        taxAmount,
        processingFee,
        total,
      },
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);

    // Proporcionar mensaje de error más específico al usuario
    const errorMessage = error.message || 'Unable to process checkout';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
