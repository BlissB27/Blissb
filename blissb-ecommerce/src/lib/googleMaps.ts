const ORIGIN_ADDRESS = "111 Manor Way, Braselton, GA 30517";

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
