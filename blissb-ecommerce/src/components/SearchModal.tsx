"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Product, searchProducts, getAllProducts } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

  // Callback ref instead of useRef: Radix Dialog only mounts DialogContent
  // (and this node) into the DOM once the dialog is open, so we need to know
  // the exact moment the node attaches/detaches — a plain useRef + useEffect
  // with an empty dep array can run before the node exists and never rerun.
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    setContentEl(node);
  }, []);

  // Debounce the search term so we don't refetch on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Keep the results wrapper's height in sync with the real content height,
  // so it smoothly grows/shrinks on every keystroke, not just on reveal.
  useEffect(() => {
    if (!contentEl) return;
    const observer = new ResizeObserver((entries) => {
      setContentHeight(entries[0].contentRect.height);
    });
    observer.observe(contentEl);
    return () => observer.disconnect();
  }, [contentEl]);

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

  // Search products when the debounced search term changes
  useEffect(() => {
    if (debouncedTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const searchAsync = async () => {
      setIsLoading(true);
      try {
        const results = await searchProducts(debouncedTerm);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
        // Fallback to local filter if API fails
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(debouncedTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    searchAsync();
  }, [debouncedTerm, allProducts]);

  const handleClose = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setFilteredProducts([]);
    onClose();
  };

  const hasQuery = searchTerm.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-brand-brown">Search Products</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for cookies, cakes, desserts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-brand-bg text-brand-text placeholder:text-brand-muted border-brand-border focus-visible:border-brand-brown focus-visible:ring-brand-brown/30 selection:bg-brand-accent/40 selection:text-brand-text"
            autoFocus
          />
        </div>

        {/* Search Results — height tracks the real content, so it grows/shrinks
            smoothly on every keystroke, not just when first revealed.
            Uses framer-motion instead of a CSS transition: when the height
            target changes again mid-animation (fast typing), a CSS transition
            can miss painting the intermediate value and jump instead —
            framer-motion interpolates from whatever the current animated
            value is, so it stays smooth under rapid updates. */}
        <motion.div
          className="overflow-hidden"
          animate={{ height: hasQuery ? contentHeight : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div ref={contentRef} className="max-h-[50vh] overflow-y-auto pt-1">
            {filteredProducts.length > 0 ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-sm text-brand-muted mb-3">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    {isLoading && (
                      <span className="w-3 h-3 border-2 border-brand-brown border-t-transparent rounded-full animate-spin" />
                    )}
                  </p>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={getProductUrl(product)}
                      onClick={handleClose}
                      className="flex items-center gap-3 p-3 rounded-lg border border-brand-border hover:border-brand-brown hover:bg-brand-bg transition-colors"
                    >
                      <div className="relative w-16 h-16 bg-brand-bg rounded-lg flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                          sizes="64px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-brand-text truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-brand-muted capitalize">
                          {product.category}
                        </p>
                        <p className="text-sm font-semibold text-brand-brown">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Product badges */}
                      <div className="flex flex-col gap-1">
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs bg-brand-success text-white rounded-full">
                            New
                          </span>
                        )}
                        {product.isOnOffer && (
                          <span className="px-2 py-1 text-xs bg-brand-brown text-white rounded-full">
                            Seasonal
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="text-center py-8 text-brand-muted">
                  <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Searching...</p>
                </div>
              ) : hasQuery ? (
                <div className="text-center py-8 text-brand-muted">
                  <p>No products found for "{searchTerm}"</p>
                  <p className="text-sm mt-2">Try searching for "cookies", "chocolate", or "brownie"</p>
                </div>
              ) : null}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
