import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Allergen Information | Bliss-B Desserts",
  description: "Allergen information for Bliss-B Desserts cookies, cakes, and desserts, handmade in a shared kitchen in Braselton, GA.",
};

export default function AllergensPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-4">
            Allergen Information
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            What&apos;s in our desserts, and how our kitchen handles allergens.
          </p>
        </div>

        <Card className="bg-white border-brand-border shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-brand-brown flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-brand-text mb-2">Shared Kitchen Notice</h2>
                <p className="text-brand-muted">
                  All Bliss-B Desserts products are handmade in the same small-batch kitchen using
                  shared equipment. While we take care to avoid cross-contamination, we cannot
                  guarantee any item is completely free of any allergen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-border shadow-sm mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-brand-text mb-4">Common Allergens Present</h2>
            <p className="text-brand-muted mb-4">
              Our desserts are made with ingredients that commonly include:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Wheat / Gluten", "Dairy", "Eggs", "Soy", "Tree nuts", "Peanuts"].map((allergen) => (
                <li key={allergen} className="text-brand-text bg-brand-bg rounded-md px-3 py-2 text-sm text-center">
                  {allergen}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-brand-text mb-2">Have a Specific Concern?</h2>
            <p className="text-brand-muted">
              If you have a severe allergy or need ingredient details for a specific product before
              ordering, please{" "}
              <a href="/contact" className="text-brand-brown hover:underline font-medium">
                contact us
              </a>{" "}
              — we&apos;re happy to walk through exactly what goes into your order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
