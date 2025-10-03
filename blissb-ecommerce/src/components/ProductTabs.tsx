"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CalendarClock } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { WaveDivider } from "./WaveDivider";
import {
  getAllProducts,
  getFeaturedProductsAsync,
  getProductsByCategoryAsync,
  type Product
} from "@/data/products";
import { motion } from "framer-motion";

type TabType = "all" | "featured" | "cookies" | "desserts" | "cakes";

const TABS = [
  { key: "all" as TabType, label: "All Products" },
  { key: "featured" as TabType, label: "Special Offer" },
  { key: "cookies" as TabType, label: "Cookies" },
  { key: "desserts" as TabType, label: "Desserts" },
  { key: "cakes" as TabType, label: "Cakes" },
];

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Load products based on active tab
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts: Product[] = [];

        switch (activeTab) {
          case "all":
            fetchedProducts = await getAllProducts();
            break;
          case "featured":
            fetchedProducts = await getFeaturedProductsAsync();
            break;
          case "cookies":
            fetchedProducts = await getProductsByCategoryAsync("cookies");
            break;
          case "desserts":
            fetchedProducts = await getProductsByCategoryAsync("desserts");
            break;
          case "cakes":
            fetchedProducts = await getProductsByCategoryAsync("cakes");
            break;
          default:
            fetchedProducts = await getAllProducts();
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeTab]);

  // Touch/Mouse handlers for swipe functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Update current index based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 280 + 16; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="bg-white relative">
      {/* Wave divider at the top */}
      <WaveDivider direction="top" color="#ffffff" className="absolute top-0 left-0 right-0" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-16 mt-12 md:mt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.6
          }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.2,
              duration: 0.5
            }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <CalendarClock className="text-[#8F4B2B] w-10 h-10"/>
            <span className="text-center text-2xl md:text-3xl font-bold text-[#8F4B2B]">
              We ship every Monday — fresh week, fresh treats!
            </span>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.3,
            duration: 0.6
          }}
          className="flex justify-center mb-8"
        >
          <div className="flex gap-1 p-1 bg-white rounded-lg overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "text-white bg-[#8F4B2B]"
                    : "text-[#6E5B4E] hover:text-[#8F4B2B] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Desktop Products Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-[#6E5B4E] text-lg">
                No products found in this category
              </p>
              <button
                onClick={() => setActiveTab("all")}
                className="mt-4 text-[#8F4B2B] hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mb-8">
          {loading ? (
            // Loading skeleton for mobile
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[280px] animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-scroll scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[280px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Scroll indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: Math.ceil(products.length / 1) }).map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      dotIndex === currentIndex ? 'bg-[#8F4B2B]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#6E5B4E] text-lg">
                No products found in this category
              </p>
              <button
                onClick={() => setActiveTab("all")}
                className="mt-4 text-[#8F4B2B] hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>

        {/* Show More Button (only if there are products) */}
        {!loading && products.length > 0 && (
          <div className="text-center">
            <button className="bg-[#8F4B2B] hover:bg-[#6f3a22] text-white px-8 py-3 rounded-md font-medium transition-colors">
              {activeTab === "all"
                ? "Load More Products"
                : activeTab === "featured"
                ? "More Special Offers"
                : `More ${TABS.find(t => t.key === activeTab)?.label}`
              }
            </button>
          </div>
        )}

        {/* Product count indicator */}
        <div className="text-center mt-4">
          {!loading && (
            <span className="text-sm text-[#6E5B4E]">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          )}
        </div>
      </div>

      {/* Wave divider at the bottom */}
      <WaveDivider direction="bottom" color="#F8F4F0" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}