"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductHighlightCard, ProductHighlightCardSkeleton } from "@/components/ProductHighlightCard";
import { getProductsByCategoryAsync, type Product } from "@/data/products";

type CategoryShowcaseProps = {
  category: Product["category"];
  title: string;
  blurb: string;
  /** Alternates the section background so consecutive showcases read as distinct bands. */
  tinted?: boolean;
};

const PAGE_SIZE = 4;
const LOAD_MORE_DELAY_MS = 500;

export function CategoryShowcase({ category, title, blurb, tinted = false }: CategoryShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
    getProductsByCategoryAsync(category)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((error) => {
        console.error(`Error loading ${category} for homepage showcase:`, error);
        if (!cancelled) setProducts([]);
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

  if (!loading && products.length === 0) return null;

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const nextBatchSize = Math.min(PAGE_SIZE, products.length - visibleCount);

  return (
    <section className={tinted ? "bg-brand-bg" : "bg-white"}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="mb-8 text-center md:text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-brand-brown">{title}</h2>
          <p className="text-brand-muted text-sm md:text-base mt-1">{blurb}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProductHighlightCardSkeleton key={index} />
              ))
            : visibleProducts.map((product) => (
                <ProductHighlightCard key={product.id} product={product} clampDescription />
              ))}

          {!loading &&
            loadingMore &&
            Array.from({ length: nextBatchSize }).map((_, index) => (
              <ProductHighlightCardSkeleton key={`more-${index}`} />
            ))}
        </div>

        {/* Sentinel: triggers the next row of 4 once it scrolls near the viewport — no extra fetch, the data's already in memory, just a brief loading state before it's revealed */}
        {!loading && hasMore && (
          <motion.div
            aria-hidden="true"
            className="h-1"
            viewport={{ margin: "200px" }}
            onViewportEnter={() => setLoadingMore(true)}
          />
        )}
      </div>
    </section>
  );
}
