"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

type ProductCardProps = {
  product: Product;
};

// Sabores disponibles para cakes (ahora desde product.flavors)
export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCartStore();
  // const currentQuantity = getItemQuantity(product.id);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [showFlavorRequired, setShowFlavorRequired] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Si es un cake con sabores disponibles y no se ha seleccionado sabor, mostrar error
    if (product.category === 'cakes' && product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      setShowFlavorRequired(true);
      return;
    }
    
    // Agregar al carrito con sabor si es necesario
    addItem(product, quantity, selectedFlavor || undefined);
    
    // Actualizar la cantidad mostrada inmediatamente
    setCurrentQuantity(prev => prev + quantity);
    
    // Reset flavor warning
    setShowFlavorRequired(false);
  };

  const handleQuantityChange = (increment: number) => {
    const newQuantity = Math.max(1, quantity + increment);
    setQuantity(newQuantity);
  };

  return (
    <Link href={`/product/${product.slug || product.id}`}>
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
        <div className="relative aspect-square">
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
              <Plus />
            </Button>
          </div>
        </div>

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

          {/* Flavor selector for cakes */}
          {product.category === 'cakes' && product.flavors && product.flavors.length > 0 && (
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

          {/* Quantity selector for all products */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6E5B4E]">Quantity:</span>
            <div className="flex items-center border border-[#E6D7CB] rounded-md">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange(-1);
                }}
                className="px-2 py-1 text-sm hover:bg-gray-50"
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

          {/* Minimum cookies reminder */}
          {product.category === 'cookies' && (
            <p className="text-xs text-[#6E5B4E]">
              If adding cookies, minimum 4 total required
            </p>
          )}

          {/* Full width add button for mobile */}
          <Button 
            onClick={handleAddToCart}
            className="w-full md:hidden bg-[#8F4B2B] hover:bg-[#6f3a22] text-white"
            size="sm"
          >
            Add to Cart ({quantity})
          </Button>
        </div>
      </Card>
      </motion.div>
    </Link>
  );
}