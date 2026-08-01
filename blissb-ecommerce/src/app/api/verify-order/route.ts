import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Real server-side confirmation for the order-success page. The client used to trust a
// sessionStorage flag alone (which a canceled/abandoned attempt could leave stale) — this
// asks Stripe directly whether the payment actually succeeded before the UI claims success.
export async function GET(request: NextRequest) {
  const paymentIntentId = request.nextUrl.searchParams.get("payment_intent");

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Missing payment_intent" }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paid = paymentIntent.status === "succeeded";
    const orderNumber = `BLISS-${paymentIntentId.slice(-8).toUpperCase()}`;

    return NextResponse.json({ paid, orderNumber });
  } catch (error) {
    console.error("Error verifying payment intent:", error);
    return NextResponse.json({ paid: false, orderNumber: null }, { status: 200 });
  }
}
