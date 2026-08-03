"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { getProductsByCategoryAsync, type Product } from "@/data/products";

const PAGE_SIZE = 8;
const LOAD_MORE_DELAY_MS = 500;

type CategoryProductGridProps = {
  category: Product["category"];
  /** Pre-rendered icon element (e.g. <Cookie className="..." />) — passing a bare
   * component reference from a server component into this client component isn't
   * serializable across the RSC boundary, so the caller renders it instead. */
  icon: ReactNode;
  /** Short label used in the empty/error states, e.g. "Cookies" */
  categoryLabel: string;
};

export function CategoryProductGrid({
  category,
  icon,
  categoryLabel,
}: CategoryProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
    getProductsByCategoryAsync(category)
      .then((data) => {
        // Pre-made boxes (e.g. Mini Cookie Box) aren't an individual cookie
        // choice — keep them out of this grid so they don't sit mixed in
        // with the actual cookies (still reachable via their own product page).
        if (!cancelled) setProducts(data.filter((product) => !product.isSoldInBox));
      })
      .catch((error) => {
        console.error(`Error fetching ${category} products:`, error);
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    if (!loadingMore) return;
    const timeout = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
      setLoadingMore(false);
    }, LOAD_MORE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [loadingMore, products.length]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const nextBatchSize = Math.min(PAGE_SIZE, products.length - visibleCount);

  return (
    <div>
      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {loadingMore &&
              Array.from({ length: nextBatchSize }).map((_, index) => (
                <ProductCardSkeleton key={`more-${index}`} />
              ))}
          </div>
        )
      )}

      {/* Sentinel: triggers the next batch of 8 once it scrolls near the viewport */}
      {!loading && hasMore && (
        <motion.div
          aria-hidden="true"
          className="h-1"
          viewport={{ margin: "200px" }}
          onViewportEnter={() => setLoadingMore(true)}
        />
      )}

      {/* Load-failed state — distinct from a genuinely empty category */}
      {!loading && loadFailed && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-brand-bg rounded-full flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-4">
            We&apos;re having trouble loading products
          </h2>
          <p className="text-brand-muted mb-6">
            Please refresh the page. If this keeps happening, contact us and we&apos;ll help you place your order directly.
          </p>
        </div>
      )}

      {/* Genuine empty state */}
      {!loading && !loadFailed && products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-brand-bg rounded-full flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-4">
            No {categoryLabel} Available
          </h2>
          <p className="text-brand-muted mb-6">
            We&apos;re currently updating our {categoryLabel.toLowerCase()} selection. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
