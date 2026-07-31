import { ProductDetailPage } from "@/components/ProductDetailPage";

export default async function CookieProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  return <ProductDetailPage category="cookies" productSlug={productSlug} />;
}
