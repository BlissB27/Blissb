import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Wheat, Milk, Egg, Bean, TreePine, Sprout, type LucideIcon } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";

export const metadata: Metadata = {
  title: "Allergen Information | Bliss-B Desserts",
  description: "Allergen information for Bliss-B Desserts cookies, cakes, and desserts, handmade in a shared kitchen in Braselton, GA.",
  alternates: { canonical: "/allergens" },
};

const ALLERGENS: { label: string; Icon: LucideIcon }[] = [
  { label: "Wheat / Gluten", Icon: Wheat },
  { label: "Dairy", Icon: Milk },
  { label: "Eggs", Icon: Egg },
  { label: "Soy", Icon: Bean },
  { label: "Tree nuts", Icon: TreePine },
  { label: "Peanuts", Icon: Sprout },
];

export default function AllergensPage() {
  return (
    <div className="relative min-h-screen bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-4">
            Allergen Information
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            What&apos;s in our desserts, and how our kitchen handles allergens.
          </p>
        </div>

        {/* Shared Kitchen Notice — the one thing on this page that actually
            matters for someone with an allergy, so it gets the same warning
            treatment as the allergy note on the product page, not a plain card. */}
        <div className="flex items-start gap-3 rounded-lg border border-brand-brown bg-brand-brown/10 p-6 mb-10">
          <AlertTriangle className="w-6 h-6 text-brand-brown flex-shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-brand-text mb-2">Shared Kitchen Notice</h2>
            <p className="text-brand-muted">
              All Bliss-B Desserts products are handmade in the same small-batch kitchen using
              shared equipment. While we take care to avoid cross-contamination, we cannot
              guarantee any item is completely free of any allergen.
            </p>
          </div>
        </div>

        {/* Common Allergens — icon badges instead of plain text pills */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-brand-text mb-1">Common Allergens Present</h2>
          <p className="text-brand-muted mb-6">
            Our desserts are made with ingredients that commonly include:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ALLERGENS.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-brand-border bg-white px-4 py-6 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-brand-text">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Have a specific concern? — same compact callout treatment used on
            /policies and the address block on /contact, for consistency. */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand-brown bg-brand-brown/10 px-6 py-5">
          <div className="text-center sm:text-left">
            <p className="font-medium text-brand-text">Have a specific concern?</p>
            <p className="text-sm text-brand-muted">
              If you have a severe allergy or need ingredient details before ordering, we&apos;re
              happy to walk through exactly what goes into your order.
            </p>
          </div>
          <Link href="/contact" className="flex-shrink-0 text-sm font-medium text-brand-brown hover:underline">
            Contact us →
          </Link>
        </div>
      </div>

      <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />
    </div>
  );
}
