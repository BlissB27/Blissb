import type { Metadata } from "next";
import { Suspense } from "react";
import { CorporateContent } from "./CorporateContent";

export const metadata: Metadata = {
  title: "Corporate Gifting & Catering | Bliss-B Desserts",
  description: "Cookie carts, corporate gifting, and dessert catering for weddings, offices, and events in Braselton, GA. Book at least 2 weeks ahead.",
  alternates: { canonical: "/corporate" },
};

export default function CorporatePage() {
  return (
    <Suspense>
      <CorporateContent />
    </Suspense>
  );
}
