import { CalendarClock, Cake, ChefHat, Palette } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { CakesHero } from "@/components/category/CakesHero";
import { CakeFeatureSection } from "@/components/category/CakeFeatureSection";
import type { Product } from "@/data/products";
import type { HeroConfig } from "@/services/heroes";

const INFO_CARDS = [
  {
    Icon: Palette,
    title: "Flavor Options",
    description: "Choose from our selection of flavors, each one crafted for the perfect taste.",
  },
  {
    Icon: CalendarClock,
    title: "Advance Notice",
    description: "Cakes require at least 5 business days advance notice for preparation.",
  },
  {
    Icon: ChefHat,
    title: "Handcrafted",
    description: "Each cake is individually crafted by our skilled bakers using premium ingredients and techniques.",
  },
];

type CakesContentProps = {
  cakes: Product[];
  hero?: HeroConfig | null;
};

export function CakesContent({ cakes, hero }: CakesContentProps) {
  return (
    <div className="min-h-screen bg-white">
      <CakesHero cakes={cakes} hero={hero} />

      {cakes.length > 0 ? (
        cakes.map((cake, index) => <CakeFeatureSection key={cake.id} product={cake} index={index} />)
      ) : (
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Cake className="w-12 h-12 text-brand-brown mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-text mb-2">No Cakes Available</h2>
          <p className="text-brand-muted">We&apos;re currently updating our cake selection. Check back soon!</p>
        </div>
      )}

      {/* Why our cakes — same full-bleed wave band as Cookies/Desserts */}
      <section className="relative bg-brand-bg">
        <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INFO_CARDS.map((card) => (
              <div key={card.title} className="text-center">
                <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <card.Icon className="w-7 h-7 text-white" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-brand-text mb-2">{card.title}</h3>
                <p className="text-sm text-brand-muted">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />
      </section>
    </div>
  );
}
