// The bakery's kitchen address — the Google Maps Distance Matrix origin for
// delivery pricing server-side (src/lib/googleMaps.ts).
export const BAKERY_ADDRESS = "111 Manor Way, Braselton, GA 30517";

// The only pickup location — the "pick up here" address shown to customers
// client-side (DeliverySelector). Not the same place as the kitchen above.
export const PICKUP_ADDRESS = "1180 Braselton Village Parkway, Braselton, GA 30517";

// The bakery's local timezone. Single source of truth for anything that renders
// a bakery-local time (fulfillment windows, event dates), so a datetime stored
// in UTC by Strapi is always shown in Braselton's clock — never the server's
// (Vercel runs in UTC) or the visitor's browser timezone.
export const BAKERY_TIMEZONE = "America/New_York";
