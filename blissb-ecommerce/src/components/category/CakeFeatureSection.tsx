"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlavorSelector } from "@/components/FlavorSelector";
import { useProductAddToCart } from "@/hooks/useProductAddToCart";
import type { Product } from "@/data/products";
import { toSentenceCase } from "@/lib/text";

type CakeFeatureSectionProps = {
  product: Product;
  /** Alternates the image side left/right so consecutive cakes don't read as a repeated template. */
  index: number;
};

export function CakeFeatureSection({ product, index }: CakeFeatureSectionProps) {
  const isReversed = index % 2 === 1;
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

  return (
    <section id={index === 0 ? "cakes" : undefined} className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
            className={`relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg ${isReversed ? "md:order-2" : ""}`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 480px"
            />
            {product.isOnOffer && (
              <Badge className="absolute top-4 left-4 bg-brand-accent text-white text-xs font-medium">
                Seasonal
              </Badge>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1, duration: 0.6 }}
            className={isReversed ? "md:order-1" : ""}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text leading-tight mb-3">
              {product.name}
            </h2>
            {product.description && (
              <p className="text-brand-muted text-base leading-relaxed mb-4">{product.description}</p>
            )}

            {hasFlavorSelector && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.flavors!.map((flavor) => (
                  <Badge key={flavor} variant="outline" className="border-brand-border text-brand-text">
                    {toSentenceCase(flavor)}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold text-brand-brown">${product.price.toFixed(2)}</span>
              {product.isOnOffer && product.originalPrice && (
                <span className="text-base text-brand-muted line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button size="lg" onClick={() => handleAddToCart()}>
              {hasFlavorSelector ? "Choose Your Flavor" : "Add to Cart"}
            </Button>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-600 mt-3">
                {errorMessage}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-brown">{product.name}</DialogTitle>
          </DialogHeader>

          {hasFlavorSelector && (
            <FlavorSelector
              flavors={product.flavors ?? []}
              flavorOptions={product.flavorOptions}
              fixedTarget={false}
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
            disabled={hasFlavorSelector ? !boxFlavors : false}
            className="w-full"
          >
            Add to Cart
          </AddToCartButton>
        </DialogContent>
      </Dialog>
    </section>
  );
}
