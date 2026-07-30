"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/AddToCartButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cartStore";
import type { BoxFlavor } from "@/store/cartStore";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";
import { FlavorSelector } from "@/components/FlavorSelector";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [boxFlavors, setBoxFlavors] = useState<BoxFlavor[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasFlavorSelector = !!product.flavors && product.flavors.length > 0;
  const isUnconfiguredBox = product.isSoldInBox && !product.boxSize;
  const needsOptions = hasFlavorSelector && !isUnconfiguredBox;

  const finishAdd = (options: { boxFlavors?: BoxFlavor[] }): boolean => {
    setErrorMessage(null);
    const addedQuantity = options.boxFlavors
      ? options.boxFlavors.reduce((sum, f) => sum + f.quantity, 0)
      : 1;

    const result = addItem(product, { quantity: 1, ...options });
    if (!result.success) {
      setErrorMessage(result.error ?? "Couldn't add this item to your cart.");
      return false;
    }
    setCurrentQuantity((prev) => prev + addedQuantity);
    setBoxFlavors(null);
    return true;
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>): boolean => {
    e.preventDefault();
    if (isUnconfiguredBox) return false;

    if (needsOptions) {
      setIsOptionsOpen(true);
      return false;
    }

    return finishAdd({});
  };

  const handleConfirmOptions = (): boolean => {
    if (hasFlavorSelector && !boxFlavors) return false; // FlavorSelector shows the invalid state
    return finishAdd({
      boxFlavors: hasFlavorSelector ? boxFlavors ?? undefined : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }}
      className="h-full"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition-shadow duration-200 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square bg-brand-bg">
          <Link href={`/product/${product.slug || product.id}`} className="absolute inset-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />
          </Link>

          <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <Badge className="bg-brand-success text-white text-xs font-medium">New flavor</Badge>
            )}
            {product.isOnOffer && (
              <Badge className="bg-brand-accent text-white text-xs font-medium">Seasonal</Badge>
            )}
          </div>

          {isMounted && currentQuantity > 0 && (
            <span className="absolute top-3 right-3 rounded-full bg-brand-success px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              {currentQuantity} in cart
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Link href={`/product/${product.slug || product.id}`}>
            <h3 className="font-display text-base font-semibold text-brand-text line-clamp-1 hover:text-brand-brown transition-colors">
              {product.name}
            </h3>
          </Link>

          <span className="font-display text-lg font-bold text-brand-brown">
            ${product.price.toFixed(2)}
            {product.isOnOffer && product.originalPrice && (
              <span className="ml-2 text-sm font-normal text-brand-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </span>

          {product.description && (
            <p className="text-sm text-brand-muted line-clamp-2">{product.description}</p>
          )}

          {isUnconfiguredBox ? (
            <p className="text-xs text-brand-muted mt-auto">
              This box isn&apos;t available online yet — please contact us directly to order it.
            </p>
          ) : (
            <div className="mt-auto pt-2">
              <AddToCartButton onAdd={handleAddToCart} className="w-full" size="sm">
                Add to Cart
              </AddToCartButton>
              {errorMessage && (
                <p role="alert" className="text-xs text-red-600 mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Options modal — flavor split, kept out of the card so every card looks the same */}
      <Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-brown">{product.name}</DialogTitle>
            <DialogDescription>Choose your options before adding this to your cart.</DialogDescription>
          </DialogHeader>

          {hasFlavorSelector && (
            <FlavorSelector
              flavors={product.flavors ?? []}
              fixedTarget={!!product.isSoldInBox}
              targetQuantity={product.isSoldInBox ? (product.boxSize as number) : undefined}
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
    </motion.div>
  );
}
