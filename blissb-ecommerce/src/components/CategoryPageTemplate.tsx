import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategoryAsync, type Product } from "@/data/products";
import type { LucideIcon } from "lucide-react";

export type CategoryInfoCard = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

type CategoryPageTemplateProps = {
  category: Product["category"];
  Icon: LucideIcon;
  /** Full display heading, e.g. "Our Cakes Collection" */
  title: string;
  /** Short label used in the empty/error states and the product-count line, e.g. "Cakes" / "cake" */
  categoryLabel: string;
  optionLabel: string;
  optionLabelPlural: string;
  blurb: string;
  infoCards: CategoryInfoCard[];
};

export async function CategoryPageTemplate({
  category,
  Icon,
  title,
  categoryLabel,
  optionLabel,
  optionLabelPlural,
  blurb,
  infoCards,
}: CategoryPageTemplateProps) {
  let products: Product[] = [];
  let loadFailed = false;

  try {
    products = await getProductsByCategoryAsync(category);
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    loadFailed = true;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon className="text-brand-brown w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold text-brand-brown">
              {title}
            </h1>
          </div>
          <p className="text-brand-muted max-w-2xl mx-auto">{blurb}</p>
        </div>

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load-failed state — distinct from a genuinely empty category */}
        {loadFailed && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-brand-bg rounded-full flex items-center justify-center">
              <Icon className="w-12 h-12 text-brand-brown" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-4">
              We&apos;re having trouble loading products
            </h2>
            <p className="text-brand-muted mb-6">
              Please refresh the page. If this keeps happening, contact us and we&apos;ll help you place your order directly.
            </p>
          </div>
        )}

        {/* Genuine empty state */}
        {!loadFailed && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-brand-bg rounded-full flex items-center justify-center">
              <Icon className="w-12 h-12 text-brand-brown" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-4">
              No {categoryLabel} Available
            </h2>
            <p className="text-brand-muted mb-6">
              We&apos;re currently updating our {categoryLabel.toLowerCase()} selection. Check back soon!
            </p>
          </div>
        )}

        {/* Product Count */}
        {!loadFailed && (
          <div className="text-center mt-8">
            <span className="text-sm text-brand-muted">
              Showing {products.length} {products.length === 1 ? optionLabel : optionLabelPlural}
            </span>
          </div>
        )}

        {/* Info Section */}
        <section className="mt-16 bg-brand-bg rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {infoCards.map((card) => (
              <div key={card.title} className="text-center">
                <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <card.Icon className="w-7 h-7 text-white" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-brand-text mb-2">{card.title}</h3>
                <p className="text-sm text-brand-muted">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
