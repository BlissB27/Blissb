import type { ReactNode } from "react";
import { CategoryProductGrid } from "@/components/CategoryProductGrid";
import { WaveDivider } from "@/components/WaveDivider";
import type { Product } from "@/data/products";
import type { LucideIcon } from "lucide-react";

export type CategoryInfoCard = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

type CategoryPageTemplateProps = {
  category: Product["category"];
  Icon: LucideIcon;
  /** Category-specific hero, rendered above everything else. */
  hero: ReactNode;
  /** Short intro heading shown between the hero and the product grid, e.g. "Our Cookie Collection" */
  title: string;
  /** Short label used in the empty/error states, e.g. "Cakes" */
  categoryLabel: string;
  blurb: string;
  infoCards: CategoryInfoCard[];
};

export function CategoryPageTemplate({
  category,
  Icon,
  hero,
  title,
  categoryLabel,
  blurb,
  infoCards,
}: CategoryPageTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {hero}

      <div id="collection" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-brown mb-4">
            {title}
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">{blurb}</p>
        </div>

        <CategoryProductGrid
          category={category}
          icon={<Icon className="w-12 h-12 text-brand-brown" />}
          categoryLabel={categoryLabel}
        />
      </div>

      {/* Info Section — full-bleed band with the same wave treatment as the homepage sections */}
      <section className="relative bg-brand-bg">
        <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {infoCards.map((card) => (
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
