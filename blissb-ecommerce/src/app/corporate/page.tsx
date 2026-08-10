import type { Metadata } from "next";
import { Suspense } from "react";
import { CorporateContent } from "./CorporateContent";
import { getHero } from "@/services/heroes";
import { getGalleryPhotos } from "@/services/gallery";
import { getCorporateSections } from "@/services/corporateSections";

export const metadata: Metadata = {
  title: "Corporate Gifting & Catering | Bliss-B Desserts",
  description: "Cookie carts, corporate gifting, and dessert catering for weddings, offices, and events in Braselton, GA. Book at least 2 weeks ahead.",
  alternates: { canonical: "/corporate" },
};

export default async function CorporatePage() {
  const [hero, gallery, sections] = await Promise.all([
    getHero("corporate"),
    getGalleryPhotos(),
    getCorporateSections(),
  ]);
  return (
    <Suspense>
      <CorporateContent hero={hero} gallery={gallery} sections={sections} />
    </Suspense>
  );
}
