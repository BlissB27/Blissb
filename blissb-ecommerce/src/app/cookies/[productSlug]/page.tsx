import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getProductByIdAsync, getProductBySlug, getAllProducts, getProductsByCategoryAsync } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";
import { getProductImageSrc } from "@/lib/productImage";
import { ProductDetailPage } from "@/components/ProductDetailPage";

// Pre-renders every cookie's product page at build time (ISR, same 60s
// revalidate window the underlying Strapi fetch already uses) instead of
// rendering every visit on demand.
export async function generateStaticParams() {
  const products = await getProductsByCategoryAsync("cookies");
  return products.filter((p) => p.slug).map((p) => ({ productSlug: p.slug as string }));
}

async function resolveProduct(productSlug: string) {
  let product = await getProductBySlug(productSlug).catch(() => null);
  if (!product) {
    product = await getProductByIdAsync(productSlug).catch(() => null);
  }
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await resolveProduct(productSlug);
  if (!product || product.category !== "cookies") return {};

  const title = `${product.name} | Bliss-B Desserts`;
  const description = product.description || `${product.name} — handcrafted in Braselton, GA.`;
  const url = getProductUrl(product);
  const image = getProductImageSrc(product.image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function CookieProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;

  const product = await resolveProduct(productSlug);

  if (!product) {
    notFound();
  }

  if (product.category !== "cookies") {
    redirect(getProductUrl(product));
  }

  const allProducts = await getAllProducts();

  return <ProductDetailPage product={product} allProducts={allProducts} />;
}
