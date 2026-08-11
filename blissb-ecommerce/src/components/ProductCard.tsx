"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Skeleton } from "@/components/ui/skeleton";
import { FlavorConfirmDialog } from "@/components/FlavorConfirmDialog";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";
import { useProductAddToCart } from "@/hooks/useProductAddToCart";
import { getProductUrl } from "@/lib/productUrl";
import { isOutOfStock } from "@/lib/stock";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const soldOut = isOutOfStock(product);
  const {
    hasFlavorSelector,
    isUnconfiguredBox,
    isOptionsOpen,
    setIsOptionsOpen,
    boxFlavors,
    setBoxFlavors,
    errorMessage,
    handleAddToCart,
    handleConfirmOptions,
  } = useProductAddToCart(product);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConfirm = (): boolean => {
    const addedQuantity = boxFlavors
      ? boxFlavors.reduce((sum, f) => sum + f.quantity, 0)
      : 1;
    const success = handleConfirmOptions();
    if (success) setCurrentQuantity((prev) => prev + addedQuantity);
    return success;
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>): boolean => {
    const success = handleAddToCart(e);
    if (success) setCurrentQuantity((prev) => prev + 1);
    return success;
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
        <div className="relative aspect-square overflow-hidden bg-brand-bg">
          <Link href={getProductUrl(product)} className="absolute inset-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${soldOut ? "opacity-60 grayscale" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />
          </Link>

          <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
            {soldOut && (
              <Badge className="bg-brand-brown text-white text-xs font-medium">Out of Stock</Badge>
            )}
            {!soldOut && product.isNew && (
              <Badge className="bg-brand-success text-white text-xs font-medium">New flavor</Badge>
            )}
            {!soldOut && product.isOnOffer && (
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
          <Link href={getProductUrl(product)}>
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

          {soldOut ? (
            <div className="mt-auto pt-2">
              <Button disabled className="w-full" size="sm" variant="outline">
                Out of Stock
              </Button>
            </div>
          ) : isUnconfiguredBox ? (
            <p className="text-xs text-brand-muted mt-auto">
              This box isn&apos;t available online yet — please contact us directly to order it.
            </p>
          ) : (
            <div className="mt-auto pt-2">
              <AddToCartButton onAdd={handleAdd} className="w-full" size="sm">
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
      <FlavorConfirmDialog
        open={isOptionsOpen}
        onOpenChange={setIsOptionsOpen}
        title={product.name}
        flavors={product.flavors ?? []}
        flavorOptions={product.flavorOptions}
        fixedTarget={!!product.isSoldInBox}
        targetQuantity={product.isSoldInBox ? (product.boxSize as number) : undefined}
        onSelectionChange={setBoxFlavors}
        errorMessage={errorMessage}
        onConfirm={handleConfirm}
        onConfirmed={() => setIsOptionsOpen(false)}
        confirmDisabled={hasFlavorSelector ? !boxFlavors : false}
      />
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl">
      <Skeleton className="aspect-square rounded-xl" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="mt-auto pt-2">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
