"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { ContactHero } from "@/components/category/ContactHero";
import { FAQ } from "@/components/Faq";

const MAPS_HREF = "https://www.google.com/maps/search/?api=1&query=111+Manor+Way%2C+Braselton%2C+GA+30517";

type DayCell = {
  days: string[];
  label: string;
  colSpan: number;
  tint?: string;
};

const WEEK: DayCell[] = [
  { days: ["MON", "TUE", "WED", "THU", "FRI"], label: "9:00 AM – 7:00 PM", colSpan: 5, tint: "bg-brand-accent/10" },
  { days: ["SAT"], label: "10:00 AM – 6:00 PM", colSpan: 1 },
  { days: ["SUN"], label: "Closed", colSpan: 1 },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />

      {/* Where & when — real operating details, not generic storefront hours, since
          Bliss-B is an order-ahead home bakery rather than a walk-in shop.
          bg-white (not bg-brand-bg) so it exactly matches the hardcoded white the
          shared FAQ's own top wave assumes is above it — anything even slightly off
          shows as a visible seam between the two. */}
      <section className="relative bg-white">
        <WaveDivider direction="top" color="#9B562C" className="absolute left-0 right-0" />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-brand-brown mb-3">
              Fresh, On Your Schedule
            </h2>
            <p className="text-brand-muted max-w-xl mx-auto">
              We&apos;re a home bakery in Braselton, GA, not a walk-in storefront — here&apos;s
              exactly how the week runs.
            </p>
          </motion.div>

          {/* Weekly rhythm strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            className="grid grid-cols-7 overflow-hidden rounded-2xl border border-brand-border"
          >
            {WEEK.map((cell) => (
              <div
                key={cell.days.join("-")}
                className={`p-4 flex flex-col text-center border-r border-brand-border last:border-r-0 ${cell.tint ?? ""}`}
                style={{ gridColumn: `span ${cell.colSpan} / span ${cell.colSpan}` }}
              >
                <div className={`grid mb-2 ${cell.days.length > 1 ? "grid-cols-5" : ""}`}>
                  {cell.days.map((day) => (
                    <p key={day} className="text-[11px] font-semibold tracking-wide text-brand-muted">
                      {day}
                    </p>
                  ))}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs font-medium text-brand-text leading-snug">{cell.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-brand-muted text-center mt-4"
          >
            Order after 2:00 PM and it rolls to the next available day. Orders ship every
            Monday, and Saturdays we&apos;re at the Suwanee Farmers Market.
          </motion.p>

          {/* Address — compact callout, not another block of prose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-brand-bg px-6 py-5"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <MapPin className="h-5 w-5 text-brand-brown flex-shrink-0 hidden sm:block" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="font-medium text-brand-text">111 Manor Way, Braselton, GA 30517</p>
                <p className="text-sm text-brand-muted">
                  Pickup by appointment once your order&apos;s confirmed &middot; delivery is
                  priced by distance from here
                </p>
              </div>
            </div>
            <a
              href={MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-sm font-medium text-brand-brown hover:underline"
            >
              Get directions →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Shared FAQ — same source as the homepage, so answers never drift between pages.
          Its own top wave (white) handles the transition, so the section above doesn't
          need one of its own — two stacked waves at the same seam just looked like a gap. */}
      <FAQ />
    </div>
  );
}
