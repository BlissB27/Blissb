import { notFound, redirect } from "next/navigation";
import { getProductByIdAsync, getProductBySlug, getAllProducts } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";
import { ProductDetailPage } from "@/components/ProductDetailPage";

export default async function DessertProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;

  let product = await getProductBySlug(productSlug).catch(() => null);
  if (!product) {
    product = await getProductByIdAsync(productSlug).catch(() => null);
  }

  if (!product) {
    notFound();
  }

  if (product.category !== "desserts") {
    redirect(getProductUrl(product));
  }

  const allProducts = await getAllProducts();

  return <ProductDetailPage product={product} allProducts={allProducts} />;
}
