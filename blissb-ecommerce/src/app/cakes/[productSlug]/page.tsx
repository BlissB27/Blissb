import { ProductDetailPage } from "@/components/ProductDetailPage";

export default async function CakeProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  return <ProductDetailPage category="cakes" productSlug={productSlug} />;
}
