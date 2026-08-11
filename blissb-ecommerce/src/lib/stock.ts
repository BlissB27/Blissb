import type { Product } from "@/data/products";

// Stock is Strapi's source of truth (a required integer, defaulting to 0), but
// the local fallback catalog leaves it undefined — treat "no number" as
// in-stock so nothing is ever hidden just because inventory wasn't provided.
export function isOutOfStock(product: Pick<Product, "stock">): boolean {
  return typeof product.stock === "number" && product.stock <= 0;
}
