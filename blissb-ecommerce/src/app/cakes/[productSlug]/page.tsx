import { notFound, redirect } from "next/navigation";
import { getProductByIdAsync, getProductBySlug, getAllProducts } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";
import { ProductDetailPage } from "@/components/ProductDetailPage";

export default async function CakeProductPage({
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

  if (product.category !== "cakes") {
    redirect(getProductUrl(product));
  }

  const allProducts = await getAllProducts();

  return <ProductDetailPage product={product} allProducts={allProducts} />;
}
