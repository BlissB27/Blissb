import { NextRequest, NextResponse } from "next/server";
import { getPlaceAddressDetails, GoogleMapsError } from "@/lib/googleMaps";

// Resolves a picked autocomplete suggestion into a structured street/city/state/zip
// address. The Google Maps key stays server-only, same as address-autocomplete.
export async function POST(request: NextRequest) {
  try {
    const { placeId, sessionToken } = await request.json();

    if (!placeId || typeof placeId !== "string" || !sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json({ error: "placeId and sessionToken are required" }, { status: 400 });
    }

    const address = await getPlaceAddressDetails(placeId, sessionToken);
    return NextResponse.json(address);
  } catch (error) {
    console.error("Error fetching place details:", error);
    const message = error instanceof GoogleMapsError ? error.message : "Couldn't fetch address details.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
