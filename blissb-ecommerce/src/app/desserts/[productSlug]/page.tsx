import { ProductDetailPage } from "@/components/ProductDetailPage";

export default async function DessertProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  return <ProductDetailPage category="desserts" productSlug={productSlug} />;
}
