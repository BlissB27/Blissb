import { BAKERY_ADDRESS as ORIGIN_ADDRESS } from "./bakeryLocation";

export class GoogleMapsError extends Error {}

/**
 * Driving distance in miles from the bakery (Braselton, GA) to a destination address,
 * via the Google Maps Distance Matrix API. Server-side only — never expose the API key to the client.
 */
export async function getDrivingMilesFromOrigin(destinationAddress: string): Promise<number> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new GoogleMapsError("GOOGLE_MAPS_API_KEY is not configured");
  }

  const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
  url.searchParams.set("origins", ORIGIN_ADDRESS);
  url.searchParams.set("destinations", destinationAddress);
  url.searchParams.set("units", "imperial");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new GoogleMapsError(`Distance Matrix API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new GoogleMapsError(`Distance Matrix API error: ${data.status}${data.error_message ? ` — ${data.error_message}` : ""}`);
  }

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") {
    throw new GoogleMapsError(`Could not calculate distance to this address (${element?.status ?? "no result"}).`);
  }

  const meters = element.distance.value;
  const miles = meters / 1609.344;
  return miles;
}

export type AddressSuggestion = { placeId: string; label: string };

/**
 * Address autocomplete suggestions as the customer types, via the Places API
 * (New). Server-side only — the frontend calls our own /api/address-autocomplete
 * route instead of talking to Google directly, so this key never reaches the browser.
 */
export async function getAddressAutocomplete(input: string, sessionToken: string): Promise<AddressSuggestion[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new GoogleMapsError("GOOGLE_MAPS_API_KEY is not configured");
  }
  if (!input.trim()) return [];

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
    },
    body: JSON.stringify({
      input,
      sessionToken,
      includedRegionCodes: ["us"],
    }),
  });

  if (!response.ok) {
    throw new GoogleMapsError(`Places Autocomplete request failed with status ${response.status}`);
  }

  const data = await response.json();
  const suggestions = (data.suggestions ?? []) as any[];

  return suggestions
    .filter((s) => s.placePrediction)
    .map((s) => ({
      placeId: s.placePrediction.placeId as string,
      label: (s.placePrediction.text?.text as string) ?? "",
    }));
}

export type StructuredAddress = { street: string; city: string; state: string; zip: string };

/**
 * Resolves a Places autocomplete selection into a structured street/city/state/zip
 * address, via the Place Details (New) endpoint. Pass the same sessionToken used
 * for the autocomplete calls that led to this placeId — that's what bundles the
 * whole search into one billing session instead of charging per keystroke.
 */
export async function getPlaceAddressDetails(placeId: string, sessionToken: string): Promise<StructuredAddress> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new GoogleMapsError("GOOGLE_MAPS_API_KEY is not configured");
  }

  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
  url.searchParams.set("sessionToken", sessionToken);

  const response = await fetch(url.toString(), {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "addressComponents",
    },
  });

  if (!response.ok) {
    throw new GoogleMapsError(`Place Details request failed with status ${response.status}`);
  }

  const data = await response.json();
  const components = (data.addressComponents ?? []) as { types: string[]; longText: string; shortText: string }[];

  const shortOf = (type: string) => components.find((c) => c.types?.includes(type))?.shortText ?? "";
  const longOf = (type: string) => components.find((c) => c.types?.includes(type))?.longText ?? "";

  const streetNumber = shortOf("street_number");
  const route = longOf("route");
  const street = [streetNumber, route].filter(Boolean).join(" ");
  const city = longOf("locality") || longOf("sublocality") || longOf("postal_town");
  const state = shortOf("administrative_area_level_1");
  const zip = shortOf("postal_code");

  return { street, city, state, zip };
}
