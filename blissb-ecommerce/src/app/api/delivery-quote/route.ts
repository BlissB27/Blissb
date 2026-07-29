import { NextRequest, NextResponse } from "next/server";
import { getDrivingMilesFromOrigin, GoogleMapsError } from "@/lib/googleMaps";
import { getDeliveryQuote } from "@/lib/deliveryPricing";

// Live delivery-fee preview as the customer types their address at checkout.
// The Google Maps key stays server-only — the client never sees it or calls Maps directly.
export async function POST(request: NextRequest) {
  try {
    const { address, subtotal } = await request.json();

    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a complete address." }, { status: 400 });
    }

    const miles = await getDrivingMilesFromOrigin(address);
    const quote = getDeliveryQuote(miles, typeof subtotal === "number" ? subtotal : 0);

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error computing delivery quote:", error);
    const message =
      error instanceof GoogleMapsError
        ? error.message
        : "Couldn't calculate delivery for this address. Please double-check it or choose shipping/pickup instead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
