// The bakery's physical address — the Google Maps Distance Matrix origin
// server-side (src/lib/googleMaps.ts), and the "pick up here" address shown
// to customers client-side (DeliverySelector). One source, so they can't drift.
export const BAKERY_ADDRESS = "111 Manor Way, Braselton, GA 30517";

// The bakery's local timezone. Single source of truth for anything that renders
// a bakery-local time (fulfillment windows, event dates), so a datetime stored
// in UTC by Strapi is always shown in Braselton's clock — never the server's
// (Vercel runs in UTC) or the visitor's browser timezone.
export const BAKERY_TIMEZONE = "America/New_York";
