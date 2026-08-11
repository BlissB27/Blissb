import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { getAllEvents, type EventItem } from "@/services/events";
import { BAKERY_TIMEZONE } from "@/lib/bakeryLocation";
import { JsonLd } from "@/components/JsonLd";
import { buildEventJsonLd } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: "Events | Bliss-B Desserts",
  description: "Find Bliss-B Desserts at upcoming markets, fairs, and events around Braselton, GA.",
  alternates: { canonical: "/events" },
};

// Server-rendered so the flyers show on first paint. Revalidates with the
// Strapi cache window (see lib/strapi) so new events appear without a redeploy.
export default async function EventsPage() {
  let events: EventItem[] = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error("Error loading events:", error);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO: one Event schema per event so Google can surface dates/locations. */}
      {events.map((event) => (
        <JsonLd key={`ld-${event.id}`} data={buildEventJsonLd(event)} />
      ))}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-brown mb-4">Events</h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            Come say hi. Here&apos;s where you&apos;ll find Bliss-B next — markets, fairs, and pop-ups.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-brand-bg rounded-full flex items-center justify-center">
              <CalendarDays className="w-12 h-12 text-brand-brown" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-4">No events scheduled right now</h2>
            <p className="text-brand-muted">Check back soon — we&apos;ll post new dates here as they come up.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatEventDate(dateISO?: string): string | null {
  if (!dateISO) return null;
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) return null;
  // Strapi stores the datetime in UTC — always render it in the bakery's local
  // clock so the hour matches what the owner entered, regardless of where this
  // runs (Vercel = UTC) or the visitor's timezone.
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: BAKERY_TIMEZONE,
  }).format(date);
}

function EventCard({ event }: { event: EventItem }) {
  const when = formatEventDate(event.date);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition-shadow duration-200 hover:shadow-lg">
      {event.flyer && (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-bg">
          <Image
            src={event.flyer}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-lg font-semibold text-brand-text">{event.title}</h2>
        {when && (
          <p className="flex items-center gap-2 text-sm text-brand-brown">
            <CalendarDays className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
            {when}
          </p>
        )}
        {event.location && (
          <p className="flex items-center gap-2 text-sm text-brand-muted">
            <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
            {event.location}
          </p>
        )}
        {event.info && <p className="mt-1 whitespace-pre-line text-sm text-brand-muted">{event.info}</p>}
      </div>
    </div>
  );
}
