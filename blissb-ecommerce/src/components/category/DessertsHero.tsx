"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroShell, HeroEyebrow } from "@/components/category/HeroShell";
import { scrollToSection } from "@/components/category/HeroFlankingPhoto";
import type { Product } from "@/data/products";
import type { HeroConfig } from "@/services/heroes";

type DessertsHeroProps = {
  /** Real product photos for the collage — falls back gracefully while loading. */
  desserts: Product[];
  /** Textos editables desde Strapi (Hero key="desserts"); fallback a los defaults. */
  hero?: HeroConfig | null;
};

export function DessertsHero({ desserts, hero }: DessertsHeroProps) {
  const [first, second] = desserts;
  const eyebrow = hero?.eyebrow || "Handmade in Braselton, GA";
  const heading = hero?.title || "A Sweet Ending, Every Time";
  const subtitle =
    hero?.subtitle ||
    "From crisp cookie fries to warm brownies, brownie cups, mini cookies, and delicate alfajores, and more, every dessert is crafted fresh with real ingredients and the kind of detail that makes it worth saving room for.";

  return (
    <HeroShell>
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Two photos, stacked diagonally — mirrors the Corporate hero, flipped to the left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2, duration: 0.7 }}
          className="relative order-2 md:order-1 mx-auto w-full max-w-sm aspect-square"
        >
          {first && (
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: -6 }}
              whileHover={{ rotate: -2, scale: 1.05, transition: { type: "spring", damping: 15, stiffness: 300 } }}
              className="absolute left-0 top-0 w-[68%] aspect-square overflow-hidden rounded-2xl shadow-xl cursor-pointer"
            >
              <Image
                src={first.image}
                alt={first.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 260px"
                priority
              />
            </motion.div>
          )}

          {second && (
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 6 }}
              whileHover={{ rotate: 2, scale: 1.05, transition: { type: "spring", damping: 15, stiffness: 300 } }}
              className="absolute bottom-0 right-0 w-[58%] aspect-square overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
            >
              <Image src={second.image} alt={second.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 220px" />
            </motion.div>
          )}
        </motion.div>

        {/* Text, on the right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="order-1 md:order-2 text-center md:text-left"
        >
          <HeroEyebrow icon={Sparkles} align="start">{eyebrow}</HeroEyebrow>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {heading}
          </h1>
          <p className="text-white/85 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
            {subtitle}
          </p>
          <Button
            className="bg-white text-brand-brown hover:bg-white/90"
            size="lg"
            onClick={() => scrollToSection("collection")}
          >
            Shop the Collection
          </Button>
        </motion.div>
      </div>
    </HeroShell>
  );
}
