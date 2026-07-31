import type { Product } from "@/data/products";

export function getProductUrl(product: Pick<Product, "category" | "slug" | "id">): string {
  return `/${product.category}/${product.slug || product.id}`;
}
