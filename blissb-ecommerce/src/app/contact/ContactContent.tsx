"use client";

import { motion } from "framer-motion";
import { WaveDivider } from "@/components/WaveDivider";
import { ContactHero } from "@/components/category/ContactHero";
import { FAQ, type FaqEntry } from "@/components/Faq";

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

export function ContactContent({ faqs }: { faqs?: FaqEntry[] }) {
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              Here&apos;s exactly how the week runs, and when we&apos;re available to help.
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
        </div>
      </section>

      {/* Shared FAQ — same source as the homepage, so answers never drift between pages.
          Its own top wave (white) handles the transition, so the section above doesn't
          need one of its own — two stacked waves at the same seam just looked like a gap. */}
      <FAQ items={faqs && faqs.length > 0 ? faqs : undefined} />
    </div>
  );
}
