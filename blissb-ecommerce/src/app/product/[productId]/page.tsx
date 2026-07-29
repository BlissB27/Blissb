"use client";

import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Flame, Snowflake, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { BoxFlavor } from "@/store/cartStore";
import { getProductByIdAsync, getProductBySlug, getAllProducts, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { FlavorSelector } from "@/components/FlavorSelector";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [boxFlavors, setBoxFlavors] = useState<BoxFlavor[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        let productData = null;

        try {
          productData = await getProductBySlug(productId);
          if (!productData) {
            productData = await getProductByIdAsync(productId);
          }
        } catch {
          productData = await getProductByIdAsync(productId);
        }

        const allProductsData = await getAllProducts();

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);
        setAllProducts(allProductsData);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  // Productos relacionados (misma categoría, excluyendo el actual) — una sola sección, sin duplicar
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const hasFlavorSelector =
    product.isSoldInBox ||
    ((product.category === "cakes" || product.category === "cookies") && !!product.flavors && product.flavors.length > 0);

  const handleAddToCart = (): boolean => {
    setErrorMessage(null);

    if (hasFlavorSelector) {
      if (!boxFlavors) return false;
      const result = addItem(product, { boxFlavors });
      if (!result.success) {
        setErrorMessage(result.error ?? "Couldn't add this item to your cart.");
        return false;
      }
      return true;
    }

    const result = addItem(product, { quantity: selectedQuantity, customMessage: customMessage || undefined });
    if (!result.success) {
      setErrorMessage(result.error ?? "Couldn't add this item to your cart.");
      return false;
    }
    setCustomMessage("");
    return true;
  };

  const productImages = [product.image, ...(product.gallery || [])].filter((img) => img && img.length > 0);
  const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
  const validImages = productImages.length > 0 ? productImages : [placeholderImage];
  const safeSelectedImage = Math.min(selectedImage, validImages.length - 1);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-brown">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${product.category}`} className="hover:text-brand-brown capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-brown">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-brand-bg rounded-3xl p-6 lg:p-8 mb-12">
          {/* Left: Product Images */}
          <div>
            <div className="relative bg-white border border-brand-border rounded-2xl p-8 mb-4 aspect-square">
              <Image
                src={validImages[safeSelectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {validImages.length > 1 && (
              <div className="flex gap-2 justify-center">
                {validImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Show image ${index + 1} of ${product.name}`}
                    aria-current={selectedImage === index}
                    className={`relative w-16 h-16 bg-white rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-brand-brown" : "border-brand-border hover:border-brand-brown/50"
                    }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="flex items-start gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-brand-text">{product.name}</h1>
              {product.isNew && <Badge className="bg-brand-success text-white">New flavor</Badge>}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-bold text-brand-brown">${product.price.toFixed(2)}</span>
              {product.isOnOffer && product.originalPrice && (
                <span className="text-lg text-brand-muted line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-brand-muted mb-4">
              <Link href="/policies" className="underline hover:text-brand-brown">Shipping &amp; delivery</Link>{" "}
              calculated at checkout.
            </p>

            {product.description && (
              <p className="text-brand-text mb-6 leading-relaxed">{product.description}</p>
            )}

            {product.isSoldInBox && !product.boxSize && (
              <div className="mb-6 rounded-lg border border-brand-border bg-brand-bg p-4">
                <p className="text-sm text-brand-muted">
                  This box isn&apos;t available online yet — please contact us directly to order it.
                </p>
              </div>
            )}

            {product.category === "desserts" && (
              <div className="mb-6">
                <label className="text-sm text-brand-muted mb-2 block">Special message (optional)</label>
                <Input
                  placeholder="e.g., Happy Birthday John!"
                  maxLength={50}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="border-brand-border focus:border-brand-brown"
                />
                <p className="text-xs text-brand-muted mt-1">Max 50 characters</p>
              </div>
            )}

            {!product.isSoldInBox && !hasFlavorSelector && (
              <div className="mb-6">
                <p className="text-sm text-brand-muted mb-2">Quantity:</p>
                <div className="flex items-center border border-brand-border rounded-lg w-fit">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    aria-label="Decrease quantity"
                    className="p-2 hover:bg-brand-bg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedQuantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    aria-label="Increase quantity"
                    className="p-2 hover:bg-brand-bg rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {hasFlavorSelector && !(product.isSoldInBox && !product.boxSize) && (
              <FlavorSelector
                flavors={product.flavors ?? []}
                fixedTarget={!!product.isSoldInBox}
                targetQuantity={product.isSoldInBox ? (product.boxSize as number) : undefined}
                onSelectionChange={setBoxFlavors}
              />
            )}

            <div className="mb-6">
              <AddToCartButton
                onAdd={handleAddToCart}
                disabled={hasFlavorSelector ? !boxFlavors : false}
                className="w-full py-3 font-medium"
                size="lg"
              >
                Add to cart
              </AddToCartButton>
              {errorMessage && (
                <p role="alert" className="text-sm text-red-600 mt-2">{errorMessage}</p>
              )}
            </div>

            <div className="text-sm text-brand-muted space-y-1 mb-6">
              <p>Made with premium ingredients and traditional methods.</p>
              <p>Best enjoyed fresh. Store in sealed packaging.</p>
              {product.category === "cakes" && <p>Custom cakes require 24-48 hours advance notice.</p>}
            </div>

            <div className="flex items-start gap-2 text-sm text-brand-muted">
              <AlertTriangle className="w-5 h-5 text-brand-brown flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <p>
                Allergy warning: all products may contain tree nuts and food allergens. Visit our{" "}
                <Link href="/allergens" className="underline hover:text-brand-brown">allergen information</Link>{" "}
                for full details.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products — one section, not repeated */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-brand-brown mb-8">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}

        {/* Product Care */}
        <section className="mt-16 bg-brand-bg rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-brand-brown text-center mb-12">
            {product.category === "cookies" ? "Cookie care" : "Product care"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-white" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-brand-text mb-2">Shelf Life</h3>
              <p className="text-sm text-brand-muted">
                {product.category === "cookies"
                  ? "Our cookies can be kept in their original sealed packaging for up to one (1) week at room temperature."
                  : "Best consumed within 2-3 days of delivery for optimal freshness."}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="w-7 h-7 text-white" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-brand-text mb-2">
                {product.category === "cookies" ? "Enjoying Warm & Soft Cookies" : "Storage"}
              </h3>
              <p className="text-sm text-brand-muted">
                {product.category === "cookies" ? (
                  <>
                    <strong>Microwave:</strong> Heat out of the packaging for 8-10 seconds.
                    <br />
                    <strong>Best method:</strong> Preheat your oven to 350°F (180°C) and warm the cookies for 4-5 minutes.
                  </>
                ) : (
                  "Store in refrigerator. Remove 30 minutes before serving for best taste and texture."
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Snowflake className="w-7 h-7 text-white" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-brand-text mb-2">Freezing &amp; Reheating</h3>
              <p className="text-sm text-brand-muted">
                {product.category === "cookies" ? (
                  <>
                    Freeze cookies in sealed packaging inside an airtight container for up to 2 months.
                    <br />
                    <strong>To reheat:</strong> Remove from packaging, bake at 350°F (180°C) for 8-10 minutes.
                  </>
                ) : (
                  "Can be frozen for up to 1 month. Thaw in refrigerator overnight before serving."
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
