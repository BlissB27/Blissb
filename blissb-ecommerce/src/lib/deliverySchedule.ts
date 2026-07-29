// Real fulfillment schedule confirmed in the client proposal (Fase 1.5 / 2 of Propuesta Blissb.pdf):
//
// - Monday: shipping only (UPS). No same-day delivery or pickup slot exists on Monday itself.
// - Tuesday–Friday: online order window with a 2:00pm cutoff (bakery local time).
//   Before cutoff -> same-day delivery (2pm-6pm) or same-day pickup (6pm-8pm).
//   After cutoff -> rolls to the next available day of that same type.
// - Saturday: pickup only, at the Suwanee Farmers Market, 8am-12pm.
// - Sunday: no rule is confirmed in the proposal. The site's stated business hours are
//   "Sunday: Closed", so it's treated the same as Monday for delivery/pickup purposes
//   (shipping-only) — flagged as an interpretation, not a confirmed rule, until the owner confirms it.

const BAKERY_TIMEZONE = "America/New_York";
const CUTOFF_HOUR = 14; // 2:00 PM, bakery local time

export type FulfillmentType = "delivery" | "pickup";

export type FulfillmentWindow = {
  type: FulfillmentType;
  /** YYYY-MM-DD in the bakery's local calendar */
  date: string;
  dayName: string;
  window: string;
  isToday: boolean;
};

function getBakeryLocalParts(now: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BAKERY_TIMEZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  return {
    weekday: get("weekday"),
    dateISO: `${get("year")}-${get("month")}-${get("day")}`,
    hour: parseInt(get("hour"), 10),
    minute: parseInt(get("minute"), 10),
  };
}

/** Anchors at noon UTC to shift calendar dates safely without DST edge effects. */
function dateStringForOffset(baseDateISO: string, offsetDays: number): { dateISO: string; weekday: string } {
  const base = new Date(`${baseDateISO}T12:00:00Z`);
  const shifted = new Date(base.getTime() + offsetDays * 86_400_000);
  const dateISO = shifted.toISOString().split("T")[0];
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(shifted);
  return { dateISO, weekday };
}

const isTueFri = (weekday: string) => ["Tuesday", "Wednesday", "Thursday", "Friday"].includes(weekday);

function findNextWindow(type: FulfillmentType, now: Date): FulfillmentWindow {
  const bakeryNow = getBakeryLocalParts(now);
  const cutoffPassedToday =
    bakeryNow.hour > CUTOFF_HOUR || (bakeryNow.hour === CUTOFF_HOUR && bakeryNow.minute > 0);

  for (let offset = 0; offset <= 14; offset++) {
    const { dateISO, weekday } = dateStringForOffset(bakeryNow.dateISO, offset);
    const isFirstDay = offset === 0;

    if (isTueFri(weekday)) {
      if (isFirstDay && cutoffPassedToday) continue; // today's window already closed
      return {
        type,
        date: dateISO,
        dayName: weekday,
        window: type === "delivery" ? "2:00 PM - 6:00 PM" : "6:00 PM - 8:00 PM",
        isToday: isFirstDay,
      };
    }

    if (type === "pickup" && weekday === "Saturday") {
      return {
        type,
        date: dateISO,
        dayName: weekday,
        window: "8:00 AM - 12:00 PM (Suwanee Farmers Market)",
        isToday: isFirstDay,
      };
    }
  }

  // Should never happen given the loop range, but keeps the return type non-nullable.
  const fallback = dateStringForOffset(bakeryNow.dateISO, 1);
  return { type, date: fallback.dateISO, dayName: fallback.weekday, window: "", isToday: false };
}

export type FulfillmentOptions = {
  /** Nationwide shipping is always available, every day. */
  shippingAvailable: true;
  delivery: FulfillmentWindow;
  pickup: FulfillmentWindow;
};

export function getFulfillmentOptions(now: Date = new Date()): FulfillmentOptions {
  return {
    shippingAvailable: true,
    delivery: findNextWindow("delivery", now),
    pickup: findNextWindow("pickup", now),
  };
}
