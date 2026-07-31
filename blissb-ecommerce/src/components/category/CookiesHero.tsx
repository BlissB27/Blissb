"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FlavorSelector } from "@/components/FlavorSelector";
import { useProductAddToCart } from "@/hooks/useProductAddToCart";
import type { Product } from "@/data/products";
import { WaveDivider } from "@/components/WaveDivider";
import { BakeryDecor } from "@/components/category/BakeryDecor";

// Orchestrates the reveal: title/subtitle/button together, then the photo shortly after.
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 300 } },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 22, stiffness: 260 } },
};

type CookiesHeroProps = {
  /** Fetched server-side (see cookies/page.tsx) so the button never waits on a
   * client-side round trip to Strapi — null only if that fetch genuinely failed. */
  product: Product | null;
};

export function CookiesHero({ product }: CookiesHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-brown">
      <BakeryDecor />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-[1200px] px-4 pt-12 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        {/* Title, subtitle, and button reveal together as one group */}
        <motion.div variants={fadeUpVariants} className="text-center md:text-left">
          <div className="mb-4 flex items-center justify-center md:justify-start gap-2">
            <Cookie className="h-5 w-5 text-white" strokeWidth={1.75} />
            <span className="text-sm font-medium text-white">Our Most-Gifted Box</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            The Mini Cookie Box
          </h1>

          <p className="text-white/85 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
            Fifty mini cookies, your way. Mix up to five flavors — chocolate chip, red
            velvet, M&amp;M, Biscoff, Pirulin, choco brownie with oreo, or let us assort
            them for you. Perfect for gifting or celebrating.
          </p>

          <MiniCookieBoxCta product={product} />
        </motion.div>

        {/* Photo, revealed shortly after */}
        <motion.div variants={imageVariants} className="relative flex justify-center">
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 2,
              y: -8,
              transition: { type: "spring", damping: 15, stiffness: 300 },
            }}
            className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
          >
            <Image
              src="/img/cookies-hero.png"
              alt="A gift box overflowing with warm, freshly baked Bliss-B mini cookies"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 480px"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <WaveDivider direction="bottom" color="#FFFFFF" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}

function MiniCookieBoxCta({ product }: { product: Product | null }) {
  const {
    hasFlavorSelector,
    isOptionsOpen,
    setIsOptionsOpen,
    boxFlavors,
    setBoxFlavors,
    errorMessage,
    handleAddToCart,
    handleConfirmOptions,
  } = useProductAddToCart(product);

  // Server-side fetch genuinely failed — fall back to a link instead of a
  // non-functional button (see cookies/page.tsx).
  if (!product) {
    return (
      <Button asChild size="lg" className="bg-white text-brand-brown hover:bg-white/90">
        <a href="#collection">Explore Our Cookies</a>
      </Button>
    );
  }

  return (
    <>
      <Button size="lg" className="bg-white text-brand-brown hover:bg-white/90" onClick={() => handleAddToCart()}>
        Choose Your Flavors · ${product.price.toFixed(2)}
      </Button>
      {errorMessage && (
        <p role="alert" className="text-sm text-red-600 mt-3">
          {errorMessage}
        </p>
      )}

      <Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-brown">{product.name}</DialogTitle>
            <DialogDescription>Choose your options before adding this to your cart.</DialogDescription>
          </DialogHeader>

          {hasFlavorSelector && (
            <FlavorSelector
              flavors={product.flavors ?? []}
              fixedTarget
              targetQuantity={product.boxSize}
              onSelectionChange={setBoxFlavors}
            />
          )}

          {errorMessage && (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <AddToCartButton
            onAdd={handleConfirmOptions}
            onAnimationComplete={() => setIsOptionsOpen(false)}
            disabled={!boxFlavors}
            className="w-full"
          >
            Add to Cart
          </AddToCartButton>
        </DialogContent>
      </Dialog>
    </>
  );
}
