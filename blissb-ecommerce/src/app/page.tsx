import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import Banner from "@/components/Banner";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { CookieBoxBuilder } from "@/components/CookieBoxBuilder";
import { CakesHighlight } from "@/components/CakesHighlight";
import { InstagramGallery } from "@/components/InstagramGallery";
import { Awards } from "@/components/Awards";
import { FAQ } from "@/components/Faq";

// Title/description already match the root layout's defaults, which are
// written for the home page — only the canonical needs to be explicit here.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Banner />
      <section id="cookie-box-builder" className="bg-white scroll-mt-[150px] md:scroll-mt-[185px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <CookieBoxBuilder />
        </div>
      </section>
      <CakesHighlight />
      <CategoryShowcase
        category="desserts"
        title="Decadent Desserts, Made Fresh Daily"
        blurb="From rich tiramisu to creamy New York cheesecake, every dessert is handcrafted in small batches in Braselton, GA — the perfect sweet ending for any occasion."
      />
      <InstagramGallery />
      <Awards />
      <FAQ />
    </main>
  );
}
