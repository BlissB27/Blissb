"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import type { BoxFlavor } from "@/store/cartStore";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";
import { BoxFlavorSelector } from "@/components/BoxFlavorSelector";

type ProductCardProps = {
  product: Product;
};

// Sabores disponibles para cakes (ahora desde product.flavors)
export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isMounted] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [showFlavorRequired, setShowFlavorRequired] = useState(false);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [boxFlavors, setBoxFlavors] = useState<BoxFlavor[] | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.isSoldInBox) {
      if (!boxFlavors) return; // BoxFlavorSelector ya muestra el estado inválido
      addItem(product, { boxFlavors });
      setCurrentQuantity(prev => prev + boxFlavors.reduce((sum, f) => sum + f.quantity, 0));
      return;
    }

    // Si el producto tiene sabores disponibles y no se ha seleccionado sabor, mostrar error
    if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      setShowFlavorRequired(true);
      return;
    }

    // Agregar al carrito con sabor y/o mensaje personalizado
    addItem(product, {
      quantity,
      flavor: selectedFlavor || undefined,
      customMessage: customMessage || undefined,
    });

    // Actualizar la cantidad mostrada inmediatamente
    setCurrentQuantity(prev => prev + quantity);

    // Reset states
    setShowFlavorRequired(false);
    setCustomMessage(""); // Limpiar mensaje después de agregar
  };

  const handleQuantityChange = (increment: number) => {
    setQuantity(Math.max(1, quantity + increment));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 h-full">
        {/* Image container */}
        <Link href={`/product/${product.slug || product.id}`}>
          <div className="relative aspect-square cursor-pointer">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105 -mt-6"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge variant="secondary" className="bg-[#1E7A31] text-white text-xs">
                  New flavor
                </Badge>
              )}
              {product.isOnOffer && (
                <Badge variant="secondary" className="bg-[#1E7A31] text-white text-xs">
                  Seasonal
                </Badge>
              )}
            </div>

            {/* Add to cart button (overlay) - Desktop only */}
            <div className="hidden md:block absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.isSoldInBox ? !boxFlavors : false}
                className="bg-white text-[#8F4B2B] border border-[#8F4B2B] rounded-full cursor-pointer hover:bg-[#8F4B2B] hover:text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus />
              </Button>
            </div>
          </div>
        </Link>

        {/* Product info */}
        <div className="p-2 space-y-2 -mt-10">
          <h3 className="font-medium text-[#3B2A22] text-lg">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#8F4B2B] font-semibold">
                ${product.price.toFixed(2)}
              </span>
              {product.isOnOffer && product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity indicator - Solo mostrar cuando está montado en el cliente */}
            {isMounted && currentQuantity > 0 && (
              <span className="text-xs text-[#1E7A31] bg-[#1E7A31]/10 px-2 py-1 rounded-full">
                {currentQuantity} in cart
              </span>
            )}
          </div>

          {/* Box flavor selector (ex: Mini Cookie Box) */}
          {product.isSoldInBox && (
            <BoxFlavorSelector product={product} onSelectionChange={setBoxFlavors} />
          )}

          {/* Flavor selector for products with flavors (cakes, desserts, etc.) */}
          {!product.isSoldInBox && product.flavors && product.flavors.length > 0 && (
            <div className="space-y-1">
              <Select onValueChange={setSelectedFlavor} value={selectedFlavor}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Choose flavor" />
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
                <p className="text-xs text-red-500">Please select a flavor</p>
              )}
            </div>
          )}

          {/* Quantity selector - not shown for box products (quantity comes from flavor split) */}
          {!product.isSoldInBox && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6E5B4E]">Quantity:</span>
              <div className="flex items-center border border-[#E6D7CB] rounded-md">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuantityChange(-1);
                  }}
                  className="px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm border-x border-[#E6D7CB]">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuantityChange(1);
                  }}
                  className="px-2 py-1 text-sm hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Custom message input for products that allow it */}
          {product.allowCustomMessage && (
            <div className="space-y-1">
              <label className="text-sm text-[#6E5B4E]">
                Special message (optional)
              </label>
              <Input
                placeholder="e.g., Happy Birthday John!"
                maxLength={50}
                value={customMessage}
                onChange={(e) => {
                  e.preventDefault();
                  setCustomMessage(e.target.value);
                }}
                onClick={(e) => e.preventDefault()}
                className="text-sm border-[#E6D7CB] focus:border-[#8F4B2B]"
              />
              <p className="text-xs text-[#6E5B4E]">
                Max 50 characters
              </p>
            </div>
          )}

          {/* Full width add button for mobile */}
          <Button
            onClick={handleAddToCart}
            disabled={product.isSoldInBox ? !boxFlavors : false}
            className="w-full md:hidden bg-[#8F4B2B] hover:bg-[#6f3a22] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            {product.isSoldInBox ? 'Add to Cart' : `Add to Cart (${quantity})`}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}