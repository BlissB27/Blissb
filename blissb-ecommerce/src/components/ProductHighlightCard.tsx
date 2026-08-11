"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FlavorConfirmDialog } from "@/components/FlavorConfirmDialog";
import { useProductAddToCart } from "@/hooks/useProductAddToCart";
import type { Product } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";
import { isOutOfStock } from "@/lib/stock";

export function ProductHighlightCard({
  product,
  clampDescription = false,
}: {
  product: Product;
  /** Truncate the description to 2 lines — use in tighter, multi-column grids so rows stay even. */
  clampDescription?: boolean;
}) {
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

  const soldOut = isOutOfStock(product);

  return (
    <>
      <div className="flex gap-4 rounded-2xl border border-brand-border bg-white p-4 transition-shadow duration-200 hover:shadow-lg sm:flex-col sm:gap-0 sm:p-5">
        <Link
          href={getProductUrl(product)}
          className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-bg sm:h-44 sm:w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 hover:scale-105 ${soldOut ? "opacity-60 grayscale" : ""}`}
            sizes="(max-width: 640px) 96px, 240px"
          />
          {soldOut && (
            <span className="absolute top-2 left-2 rounded-full bg-brand-brown px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
              Out of Stock
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col sm:mt-4">
          <Link href={getProductUrl(product)}>
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
            {soldOut ? (
              <Button disabled size="sm" variant="outline">
                Out of Stock
              </Button>
            ) : isUnconfiguredBox ? (
              <p className="text-xs text-brand-muted">Contact us to order this box.</p>
            ) : (
              <AddToCartButton onAdd={handleAddToCart} size="sm">
                Add to Cart
              </AddToCartButton>
            )}
          </div>
          {errorMessage && (
            <p role="alert" className="text-xs text-red-600 mt-2">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

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
        onConfirm={handleConfirmOptions}
        onConfirmed={() => setIsOptionsOpen(false)}
        confirmDisabled={hasFlavorSelector ? !boxFlavors : false}
      />
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
