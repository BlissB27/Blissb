"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { BakeryDecor } from "@/components/category/BakeryDecor";
import { scrollToSection } from "@/components/category/HeroFlankingPhoto";
import type { Product } from "@/data/products";

type DessertsHeroProps = {
  /** Real product photos for the collage — falls back gracefully while loading. */
  desserts: Product[];
};

export function DessertsHero({ desserts }: DessertsHeroProps) {
  const [first, second] = desserts;

  return (
    <section className="relative overflow-hidden bg-brand-brown">
      <BakeryDecor />

      <div className="relative mx-auto max-w-[1200px] px-4 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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
          <div className="mb-4 flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={1.75} />
            <span className="text-sm font-medium text-white">Handmade in Braselton, GA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            A Sweet Ending, Every Time
          </h1>
          <p className="text-white/85 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
            From personalized brownies to individually portioned cups, every dessert is
            crafted fresh with real ingredients and the kind of detail that makes it
            worth saving room for.
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

      <WaveDivider direction="bottom" color="#FFFFFF" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
