"use client";

import { useState, use, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/store/cartStore";
import { getProductByIdAsync, getProductBySlug, getAllProducts, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  // Unwrap params with React.use()
  const { productId } = use(params);

  // All hooks must be at the top, before any conditionals
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [showFlavorRequired, setShowFlavorRequired] = useState(false);

  // Load product data
  useEffect(() => {
    const loadProductData = async () => {
      try {
        let productData = null;

        // Try to get product by slug first, then by documentId
        try {
          productData = await getProductBySlug(productId);
          if (!productData) {
            // If slug returns null, try with documentId
            productData = await getProductByIdAsync(productId);
          }
        } catch (error) {
          // If any error occurs, try with documentId
          console.log('Slug lookup failed, trying with documentId');
          productData = await getProductByIdAsync(productId);
        }

        const allProductsData = await getAllProducts();

        if (!productData) {
          setError('Product not found');
          return;
        }

        setProduct(productData);
        setAllProducts(allProductsData);
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8EDE4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F4B2B] mx-auto mb-4"></div>
          <p className="text-[#6E5B4E]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  // Productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    // Si es un cake con sabores disponibles y no se ha seleccionado sabor, mostrar error
    if (product.category === 'cakes' && product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      setShowFlavorRequired(true);
      return;
    }
    
    addItem(product, selectedQuantity, selectedFlavor || undefined);
    setShowFlavorRequired(false);
  };

  const handleRelatedProductAdd = (relatedProduct: any) => {
    // Para productos relacionados, agregar con cantidad 1 y sin sabor por ahora
    addItem(relatedProduct, 1);
  };

  // Imágenes del producto: imagen principal + galería
  const productImages = [
    product.image, // Imagen principal siempre primero
    ...(product.gallery || []) // Agregar imágenes de galería si existen
  ].filter(img => img && img.length > 0); // Filtrar valores vacíos o strings vacíos

  // Fallback si no hay imágenes válidas
  const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
  const validImages = productImages.length > 0 ? productImages : [placeholderImage];

  // Asegurar que selectedImage esté dentro del rango válido
  const safeSelectedImage = Math.min(selectedImage, validImages.length - 1);

  return (
    <div className="min-h-screen bg-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-gray-50/30 rounded-3xl p-6 lg:p-8 mb-12">
          {/* Left: Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white border rounded-3xl p-8 mb-4 aspect-square">
              <Image
                src={validImages[safeSelectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 justify-center">
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 bg-gray-50/50 rounded-xl overflow-hidden border-1 ${
                    selectedImage === index
                      ? "border-[#8F4B2B] bg-white"
                      : "border hover:border-[#E6D7CB] hover:bg-white"
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
              <span className="text-4xl font-bold text-[#1E7A31]">
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

            {/* Flavor Selection for Cakes */}
            {product.category === 'cakes' && product.flavors && product.flavors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-[#6E5B4E] mb-2">Flavor:</p>
                <Select onValueChange={setSelectedFlavor} value={selectedFlavor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your flavor" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.flavors.map((flavor) => (
                      <SelectItem key={flavor} value={flavor.toLowerCase()}>
                        {flavor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showFlavorRequired && (
                  <p className="text-sm text-red-500 mt-1">Please select a flavor to continue</p>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <p className="text-sm text-[#6E5B4E] mb-2">Quantity:</p>
              <div className="flex items-center border border-[#E6D7CB] rounded-lg w-fit">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="p-2 hover:bg-gray-50 hover:rounded-lg cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {selectedQuantity}
                </span>
                <button
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="p-2 hover:bg-gray-50 hover:rounded-lg cursor-pointer"
                >
                  +
                </button>
              </div>
              {product.category === 'cookies' && (
                <p className="text-xs text-[#6E5B4E] mt-1">
                  If adding cookies, minimum 4 total required
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#1E7A31] hover:bg-[#166728] text-white py-3 mb-6 font-medium"
              size="lg"
            >
              Add to cart
              {selectedFlavor && (
                <span className="ml-1">- {selectedFlavor.charAt(0).toUpperCase() + selectedFlavor.slice(1)}</span>
              )}
            </Button>

            {/* Product Details */}
            <div className="text-sm text-[#6E5B4E] space-y-1 mb-6">
              <p>Made with premium ingredients and traditional methods.</p>
              <p>Best enjoyed fresh. Store in sealed packaging.</p>
              {product.category === 'cakes' && (
                <p>Custom cakes require 24-48 hours advance notice.</p>
              )}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 text-xl text-[#6E5B4E] mb-6">
              <span>⚠️</span>
              <p>
                Allergy warning: all products may contain tree nuts and food allergens. Visit our{" "}
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
                    onClick={() => handleRelatedProductAdd(relatedProducts[0])}
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
          <section className="mt-16 p-8">
            <h2 className="text-4xl font-bold text-[#8F4B2B] mb-8">
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
        <section className="mt-16 bg-[#8F4B2B]/5 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-[#8F4B2B] text-center mb-12">
            {product.category === 'cookies' ? 'Cookie care' : 'Product care'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Shelf Life</h3>
              <p className="text-sm text-[#6E5B4E]">
                {product.category === 'cookies' 
                  ? "Our cookies can be kept in their original sealed packaging for up to one (1) week at room temperature."
                  : "Best consumed within 2-3 days of delivery for optimal freshness."
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{product.category === 'cookies' ? '🔥' : '🍰'}</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">
                {product.category === 'cookies' ? 'Enjoying Warm & Soft Cookies' : 'Storage'}
              </h3>
              <p className="text-sm text-[#6E5B4E]">
                {product.category === 'cookies' ? (
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
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Freezing & Reheating</h3>
              <p className="text-sm text-[#6E5B4E]">
                {product.category === 'cookies' ? (
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