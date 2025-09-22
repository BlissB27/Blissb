"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { getProductById, PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const COOKIE_QUANTITIES = [4, 10, 15];

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  // Unwrap params with React.use()
  const { productId } = use(params);
  const product = getProductById(productId);
  
  if (!product) {
    notFound();
  }

  const { addItem } = useCartStore();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    product.category === 'cookies' ? COOKIE_QUANTITIES[0] : 1
  );
  const [selectedImage, setSelectedImage] = useState(0);

  // Productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedQuantity);
  };

  // Múltiples imágenes del producto (simulado)
  const productImages = [
    product.image,
    product.image, // En una app real, tendrías múltiples imágenes
    product.image,
  ];

  return (
    <div className="min-h-screen bg-[#F8EDE4]">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#6E5B4E] mb-6">
          <Link href="/" className="hover:text-[#8F4B2B]">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${product.category}`} className="hover:text-[#8F4B2B] capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#8F4B2B]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl p-8 mb-4 aspect-square">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 justify-center">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 bg-white rounded-xl overflow-hidden border-2 ${
                    selectedImage === index 
                      ? "border-[#8F4B2B]" 
                      : "border-transparent hover:border-[#E6D7CB]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="flex items-start gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[#8F4B2B]">
                {product.name}
              </h1>
              {product.isNew && (
                <Badge className="bg-[#1E7A31] text-white">New flavor</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-[#1E7A31]">
                ${product.price.toFixed(2)}
              </span>
              {product.isOnOffer && product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-[#6E5B4E] mb-2">
              <Link href="#shipping" className="underline hover:text-[#8F4B2B]">
                Shipping
              </Link>{" "}
              calculated at checkout.
            </p>

            <p className="text-[#3B2A22] mb-6 leading-relaxed">
              {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>

            {/* Quantity Selection */}
            {product.category === 'cookies' && (
              <div className="mb-6">
                <p className="text-sm text-[#6E5B4E] mb-2">Quantity:</p>
                <div className="flex gap-2">
                  {COOKIE_QUANTITIES.map((quantity) => (
                    <button
                      key={quantity}
                      onClick={() => setSelectedQuantity(quantity)}
                      className={`px-4 py-2 rounded-full border font-medium transition-colors ${
                        selectedQuantity === quantity
                          ? "bg-[#1E7A31] text-white border-[#1E7A31]"
                          : "bg-white text-[#6E5B4E] border-[#E6D7CB] hover:border-[#1E7A31]"
                      }`}
                    >
                      {quantity}P
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Counter for non-cookies */}
            {product.category !== 'cookies' && (
              <div className="mb-6">
                <p className="text-sm text-[#6E5B4E] mb-2">Quantity:</p>
                <div className="flex items-center border border-[#E6D7CB] rounded-lg w-fit">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="p-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#1E7A31] hover:bg-[#166728] text-white py-3 mb-6 font-medium"
              size="lg"
            >
              Add to cart
            </Button>

            {/* Product Details */}
            <div className="text-sm text-[#6E5B4E] space-y-1 mb-6">
              <p>Made with premium ingredients and traditional methods.</p>
              <p>Best enjoyed fresh. Store in sealed packaging.</p>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 text-xs text-[#6E5B4E] mb-6">
              <span>⚠️</span>
              <p>
                Allergy warning: all cookies may contain tree nuts and food allergens. Visit our{" "}
                <Link href="/allergens" className="underline hover:text-[#8F4B2B]">
                  allergens info
                </Link>{" "}
                for full details.
              </p>
            </div>

            {/* Related Product Preview */}
            <div>
              <h3 className="font-medium text-[#3B2A22] mb-3">
                Maybe you'd like to also try this:
              </h3>
              {relatedProducts[0] && (
                <div className="flex items-center gap-3 p-3 border border-[#E6D7CB] rounded-lg">
                  <div className="relative w-12 h-12 bg-[#F8F4F0] rounded">
                    <Image
                      src={relatedProducts[0].image}
                      alt={relatedProducts[0].name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{relatedProducts[0].name}</h4>
                    <p className="text-xs text-[#8F4B2B]">${relatedProducts[0].price.toFixed(2)}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-[#8F4B2B] text-[#8F4B2B] hover:bg-[#8F4B2B] hover:text-white"
                  >
                    Add to cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[#8F4B2B] mb-8">
              You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Cookie Care Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[#8F4B2B] text-center mb-12">
            Cookie care
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Shelf Life</h3>
              <p className="text-sm text-[#6E5B4E]">
                Our cookies can be kept in their original sealed packaging for up to one (1) week at room temperature.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Enjoying Warm & Soft Cookies</h3>
              <p className="text-sm text-[#6E5B4E]">
                <strong>Microwave:</strong> Heat out of the packaging for 8-10 seconds.
                <br />
                <strong>Best method:</strong> Preheat your oven to 350°F (180°C) and warm the cookies for 4-5 minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Freezing & Reheating</h3>
              <p className="text-sm text-[#6E5B4E]">
                Freeze cookies in sealed packaging inside an airtight container for up to 2 months.
                <br />
                <strong>To reheat:</strong> Remove from packaging, bake at 350°F (180°C) for 8-10 minutes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}