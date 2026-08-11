import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { getUpcomingEvents, type EventItem } from "@/services/events";
import { BAKERY_TIMEZONE } from "@/lib/bakeryLocation";

// Server component. Renders nothing when there are no events, so the home page
// never shows an empty "Events" band (e.g. before any event is created in Strapi,
// or if the content-type isn't deployed yet).
export async function EventsPreview() {
  let events: EventItem[] = [];
  try {
    events = await getUpcomingEvents(3);
  } catch {
    events = [];
  }

  if (events.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-brand-brown">Find Us at an Event</h2>
            <p className="mt-2 text-brand-muted max-w-xl text-sm md:text-base">
              Markets, fairs, and pop-ups where you can grab Bliss-B in person.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-brown hover:text-brand-brown-hover flex-shrink-0"
          >
            See all events <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventPreviewCard key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-brown hover:text-brand-brown-hover"
          >
            See all events <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function formatShortDate(dateISO?: string): string | null {
  if (!dateISO) return null;
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) return null;
  // Bakery-local (see events/page.tsx) so the day can't shift when the UTC time
  // crosses midnight relative to Braselton.
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: BAKERY_TIMEZONE }).format(date);
}

function EventPreviewCard({ event }: { event: EventItem }) {
  const when = formatShortDate(event.date);
  return (
    <Link
      href="/events"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition-shadow duration-200 hover:shadow-lg"
    >
      {event.flyer && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-bg">
          <Image
            src={event.flyer}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold text-brand-text line-clamp-1">{event.title}</h3>
        {when && (
          <p className="flex items-center gap-1.5 text-sm text-brand-brown">
            <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.75} />
            {when}
          </p>
        )}
        {event.info && <p className="text-sm text-brand-muted line-clamp-2">{event.info}</p>}
      </div>
    </Link>
  );
}
