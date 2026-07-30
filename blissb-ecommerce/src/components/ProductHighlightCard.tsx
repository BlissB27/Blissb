"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/AddToCartButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FlavorSelector } from "@/components/FlavorSelector";
import { useCartStore } from "@/store/cartStore";
import type { BoxFlavor } from "@/store/cartStore";
import type { Product } from "@/data/products";

export function ProductHighlightCard({
  product,
  clampDescription = false,
}: {
  product: Product;
  /** Truncate the description to 2 lines — use in tighter, multi-column grids so rows stay even. */
  clampDescription?: boolean;
}) {
  const { addItem } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [boxFlavors, setBoxFlavors] = useState<BoxFlavor[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasFlavorSelector = !!product.flavors && product.flavors.length > 0;

  const finishAdd = (options: { boxFlavors?: BoxFlavor[] }): boolean => {
    setErrorMessage(null);
    const result = addItem(product, { quantity: 1, ...options });
    if (!result.success) {
      setErrorMessage(result.error ?? "Couldn't add this to your cart.");
      return false;
    }
    setBoxFlavors(null);
    return true;
  };

  const handleAddClick = (): boolean => {
    if (hasFlavorSelector) {
      setIsOpen(true);
      return false;
    }
    return finishAdd({});
  };

  const handleConfirm = (): boolean => {
    if (hasFlavorSelector && !boxFlavors) return false;
    return finishAdd({
      boxFlavors: hasFlavorSelector ? boxFlavors ?? undefined : undefined,
    });
  };

  return (
    <>
      <div className="flex gap-4 rounded-2xl border border-brand-border bg-white p-4 shadow-sm sm:flex-col sm:gap-0 sm:p-5">
        <Link
          href={`/product/${product.slug || product.id}`}
          className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-bg sm:h-44 sm:w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 96px, 240px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col sm:mt-4">
          <Link href={`/product/${product.slug || product.id}`}>
            <h3 className="font-display text-base font-semibold text-brand-text hover:text-brand-brown transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className={`mt-0.5 text-xs text-brand-muted ${clampDescription ? "line-clamp-2" : ""}`}>
              {product.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 sm:mt-auto sm:pt-3">
            <span className="font-display text-lg font-bold text-brand-brown">
              ${product.price.toFixed(2)}
            </span>
            <AddToCartButton onAdd={handleAddClick} size="sm">
              Add to Cart
            </AddToCartButton>
          </div>
          {errorMessage && (
            <p role="alert" className="text-xs text-red-600 mt-2">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-brown">{product.name}</DialogTitle>
            <DialogDescription>Choose your options before adding this to your cart.</DialogDescription>
          </DialogHeader>

          {hasFlavorSelector && (
            <FlavorSelector
              flavors={product.flavors ?? []}
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
            onAdd={handleConfirm}
            onAnimationComplete={() => setIsOpen(false)}
            disabled={hasFlavorSelector ? !boxFlavors : false}
            className="w-full"
          >
            Add to Cart
          </AddToCartButton>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ProductHighlightCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 sm:flex-col sm:gap-0 sm:p-5">
      <Skeleton className="h-24 w-24 flex-shrink-0 rounded-xl sm:h-44 sm:w-full" />
      <div className="flex min-w-0 flex-1 flex-col sm:mt-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-4/5" />
        <div className="mt-3 flex items-center justify-between gap-3 sm:mt-auto sm:pt-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
