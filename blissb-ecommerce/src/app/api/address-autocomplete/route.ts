import { NextRequest, NextResponse } from "next/server";
import { getAddressAutocomplete, GoogleMapsError } from "@/lib/googleMaps";

// Address suggestions as the customer types (billing/shipping address).
// The Google Maps key stays server-only — the client never sees it or calls Places directly.
export async function POST(request: NextRequest) {
  try {
    const { input, sessionToken } = await request.json();

    if (!input || typeof input !== "string" || !sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json({ error: "input and sessionToken are required" }, { status: 400 });
    }

    const suggestions = await getAddressAutocomplete(input, sessionToken);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    const message = error instanceof GoogleMapsError ? error.message : "Couldn't fetch address suggestions.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
