import { notFound, redirect } from "next/navigation";
import { getProductByIdAsync, getProductBySlug } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";

// Old flat product URL, kept only as a redirect to the new /{category}/{slug}
// route so existing links and bookmarks don't 404.
export default async function LegacyProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  let product = await getProductBySlug(productId).catch(() => null);
  if (!product) {
    product = await getProductByIdAsync(productId).catch(() => null);
  }

  if (!product) {
    notFound();
  }

  redirect(getProductUrl(product));
}
