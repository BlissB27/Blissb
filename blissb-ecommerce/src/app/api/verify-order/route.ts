import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Real server-side confirmation for the order-success page. The client used to trust a
// sessionStorage flag alone (which a canceled/abandoned attempt could leave stale) — this
// asks Stripe directly whether the session actually completed before the UI claims success.
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const orderNumber = `BLISS-${sessionId.slice(-8).toUpperCase()}`;

    return NextResponse.json({ paid, orderNumber });
  } catch (error) {
    console.error("Error verifying order session:", error);
    return NextResponse.json({ paid: false, orderNumber: null }, { status: 200 });
  }
}
