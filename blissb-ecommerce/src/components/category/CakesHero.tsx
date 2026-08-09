"use client";

import { motion } from "framer-motion";
import { Cake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroShell, HeroEyebrow } from "@/components/category/HeroShell";
import { HeroFlankingPhoto, scrollToSection } from "@/components/category/HeroFlankingPhoto";
import type { Product } from "@/data/products";
import type { HeroConfig } from "@/services/heroes";

type CakesHeroProps = {
  /** Real product photos to flank the headline — falls back gracefully while loading. */
  cakes: Product[];
  /** Textos editables desde Strapi (Hero key="cakes"); fallback a los defaults. */
  hero?: HeroConfig | null;
};

export function CakesHero({ cakes, hero }: CakesHeroProps) {
  const eyebrow = hero?.eyebrow || "Cakes for Every Occasion";
  const heading = hero?.title || "Cakes Worth Celebrating";
  const subtitle =
    hero?.subtitle ||
    "Handcrafted layer by layer, filled and finished with your choice of flavor. Give us at least 5 business days notice and we'll do the rest.";
  return (
    <HeroShell>
      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex items-center justify-center gap-6 lg:gap-12">
          <HeroFlankingPhoto src={cakes[0]?.image} alt={cakes[0]?.name} tilt="left" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
            className="text-center max-w-xl"
          >
            <HeroEyebrow icon={Cake}>{eyebrow}</HeroEyebrow>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {heading}
            </h1>
            <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
              {subtitle}
            </p>
            <Button
              className="mt-6 bg-white text-brand-brown hover:bg-white/90"
              size="lg"
              onClick={() => scrollToSection("cakes")}
            >
              See Our Cakes
            </Button>
          </motion.div>

          <HeroFlankingPhoto src={cakes[1]?.image} alt={cakes[1]?.name} tilt="right" />
        </div>
      </div>
    </HeroShell>
  );
}
