"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { ProductHighlightCard, ProductHighlightCardSkeleton } from "@/components/ProductHighlightCard";
import { getProductsByCategoryAsync, type Product } from "@/data/products";

export function CakesHighlight() {
  const [cakes, setCakes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategoryAsync("cakes")
      .then(setCakes)
      .catch((error) => {
        console.error("Error loading cakes for homepage highlight:", error);
        setCakes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && cakes.length === 0) return null;

  return (
    <section className="relative bg-brand-brown">
      <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 md:py-8 my-8 md:my-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Cakes for Every Occasion
            </h2>
            <p className="mt-4 text-white/85 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
              A craving, an anniversary, a milestone worth celebrating, any reason is
              reason enough. Choose your flavor, add a name, and let the cake do the rest.
            </p>
            <Button asChild className="mt-6 bg-white text-brand-brown hover:bg-white/90">
              <Link href="/cakes">Shop All Cakes</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.15, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {loading
              ? Array.from({ length: 2 }).map((_, index) => <ProductHighlightCardSkeleton key={index} />)
              : cakes.map((cake) => <ProductHighlightCard key={cake.id} product={cake} />)}
          </motion.div>
        </div>
      </div>

      <WaveDivider direction="bottom" color="#ffffff" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
