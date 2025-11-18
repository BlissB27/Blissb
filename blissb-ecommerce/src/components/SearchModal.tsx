"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Product, searchProducts, getAllProducts } from "@/data/products";
import Link from "next/link";
import Image from "next/image";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all products when modal opens
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      const loadProducts = async () => {
        setIsLoading(true);
        try {
          const products = await getAllProducts();
          setAllProducts(products);
        } catch (error) {
          console.error('Error loading products for search:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadProducts();
    }
  }, [isOpen, allProducts.length]);

  // Search products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const searchAsync = async () => {
      setIsLoading(true);
      try {
        const results = await searchProducts(searchTerm);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
        // Fallback to local filter if API fails
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    searchAsync();
  }, [searchTerm, allProducts]);

  const handleClose = () => {
    setSearchTerm("");
    setFilteredProducts([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-[#8F4B2B]">Search Products</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E5B4E] w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for cookies, cakes, desserts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-[#E6D7CB] focus:border-[#8F4B2B]"
            autoFocus
          />
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {searchTerm.trim() === "" ? (
            <div className="text-center py-8 text-[#6E5B4E]">
              <Search className="w-12 h-12 mx-auto mb-4 text-[#E6D7CB]" />
              <p>Start typing to search for products...</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 text-[#6E5B4E]">
              <div className="w-8 h-8 border-4 border-[#8F4B2B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Searching...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-[#6E5B4E]">
              <p>No products found for "{searchTerm}"</p>
              <p className="text-sm mt-2">Try searching for "cookies", "chocolate", or "brownie"</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#6E5B4E] mb-3">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E6D7CB] hover:border-[#8F4B2B] hover:bg-[#F8EDE4] transition-colors"
                >
                  <div className="relative w-16 h-16 bg-[#F8F4F0] rounded-lg flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                      sizes="64px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#3B2A22] truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#6E5B4E] capitalize">
                      {product.category}
                    </p>
                    <p className="text-sm font-semibold text-[#8F4B2B]">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Product badges */}
                  <div className="flex flex-col gap-1">
                    {product.isNew && (
                      <span className="px-2 py-1 text-xs bg-[#1E7A31] text-white rounded-full">
                        New
                      </span>
                    )}
                    {product.isOnOffer && (
                      <span className="px-2 py-1 text-xs bg-[#8F4B2B] text-white rounded-full">
                        Seasonal
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick suggestions if no search term */}
        {searchTerm.trim() === "" && (
          <div className="border-t pt-4">
            <p className="text-sm text-[#6E5B4E] mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['chocolate', 'cookies', 'brownie', 'vanilla'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(term)}
                  className="text-xs border-[#E6D7CB] text-[#6E5B4E] hover:border-[#8F4B2B] hover:text-[#8F4B2B]"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}