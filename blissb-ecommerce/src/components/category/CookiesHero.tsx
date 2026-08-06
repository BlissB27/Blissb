"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlavorConfirmDialog } from "@/components/FlavorConfirmDialog";
import { useProductAddToCart } from "@/hooks/useProductAddToCart";
import type { Product } from "@/data/products";
import { HeroShell, HeroEyebrow } from "@/components/category/HeroShell";
import { getProductImageSrc } from "@/lib/productImage";

// Used only if the server-side Strapi fetch genuinely failed (see cookies/page.tsx) —
// keeps the hero from rendering blank instead of reflecting missing product data.
const FALLBACK_TITLE = "The Mini Cookie Box";
const FALLBACK_DESCRIPTION =
  "Fifty mini cookies, your way. Mix up to five flavors — chocolate chip, red velvet, M&M, Biscoff, Pirulin, choco brownie with oreo, or let us assort them for you. Perfect for gifting or celebrating.";
const FALLBACK_IMAGE = "/img/cookies-hero.png";

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
  const title = product?.name || FALLBACK_TITLE;
  const description = product?.description || FALLBACK_DESCRIPTION;
  const image = product?.image ? getProductImageSrc(product.image) : FALLBACK_IMAGE;

  return (
    <HeroShell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        {/* Title, subtitle, and button reveal together as one group */}
        <motion.div variants={fadeUpVariants} className="text-center md:text-left">
          <HeroEyebrow icon={Cookie} align="start">Our Most-Gifted Box</HeroEyebrow>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>

          <p className="text-white/85 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
            {description}
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
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 480px"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </HeroShell>
  );
}

function MiniCookieBoxCta({ product }: { product: Product | null }) {
  const {
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

      <FlavorConfirmDialog
        open={isOptionsOpen}
        onOpenChange={setIsOptionsOpen}
        title={product.name}
        flavors={product.flavors ?? []}
        fixedTarget
        targetQuantity={product.boxSize}
        onSelectionChange={setBoxFlavors}
        errorMessage={errorMessage}
        onConfirm={handleConfirmOptions}
        onConfirmed={() => setIsOptionsOpen(false)}
        confirmDisabled={!boxFlavors}
      />
    </>
  );
}
