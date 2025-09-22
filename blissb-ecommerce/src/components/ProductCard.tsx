"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

// Opciones de cantidad para cookies
const COOKIE_QUANTITIES = [4, 10, 15];

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCartStore();
  const currentQuantity = getItemQuantity(product.id);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    product.category === 'cookies' ? COOKIE_QUANTITIES[0] : 1
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación cuando se hace click en el botón
    addItem(product, selectedQuantity);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200 h-full ">
        {/* Image container */}
        <div className="relative aspect-square ">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105 -mt-6"
            
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
                Offer
              </Badge>
            )}
          </div>

          {/* Add to cart button (overlay) */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-white text-[#8F4B2B] border border-[#8F4B2B] rounded-full cursor-pointer hover:bg-[#8F4B2B] hover:text-white shadow-sm"
            >
              <Plus/>
              
            </Button>
          </div>
        </div>

        {/* Product info */}
        <div className="p-2 space-y-1 -mt-10">
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
            
            {/* Quantity indicator */}
            {currentQuantity > 0 && (
              <span className="text-xs text-[#1E7A31] bg-[#1E7A31]/10 px-2 py-1 rounded-full">
                {currentQuantity} in cart
              </span>
            )}
          </div>

          {/* Min quantity selector for cookies */}
          {product.category === 'cookies' && (
            <div className="flex gap-1 mb-2">
              {COOKIE_QUANTITIES.map((quantity) => (
                <button
                  key={quantity}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedQuantity(quantity);
                  }}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    selectedQuantity === quantity
                      ? "bg-[#1E7A31] text-white border-[#1E7A31]"
                      : "bg-white text-[#6E5B4E] border-[#E6D7CB] hover:border-[#1E7A31]"
                  }`}
                >
                  {quantity}P
                </button>
              ))}
            </div>
          )}

          {/* Full width add button for mobile */}
          <Button 
            onClick={handleAddToCart}
            className="w-full md:hidden bg-[#8F4B2B] hover:bg-[#6f3a22] text-white"
            size="sm"
          >
            Add to Cart
            {product.category === 'cookies' && (
              <span className="ml-1">({selectedQuantity})</span>
            )}
          </Button>
        </div>
      </Card>
    </Link>
  );
}