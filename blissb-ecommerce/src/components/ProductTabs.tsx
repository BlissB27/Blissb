"use client";

import { useState, useEffect, useRef } from "react";
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
  { key: "featured" as TabType, label: "Seasonal Specials" },
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
  const [visibleCount, setVisibleCount] = useState(8);

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
        setVisibleCount(8); // Reset visible count when tab changes
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeTab]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  // Touch handlers for swipe functionality (simplified for better mobile performance)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (startX - x) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft + walk;
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
          className="flex justify-center mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4"
        >
          <div className="flex gap-1 md:gap-2 p-1 bg-white rounded-lg">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.slice(0, visibleCount).map(product => (
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
            <div className="relative -mx-4 px-4">
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x select-none scrollbar-hide"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[280px] snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Scroll indicators - only show if there are multiple products */}
              {products.length > 1 && products.length <= 10 && (
                <div className="flex justify-center mt-4 gap-1.5">
                  {products.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => {
                        if (scrollRef.current) {
                          const cardWidth = 280 + 16; // card width + gap
                          scrollRef.current.scrollTo({
                            left: dotIndex * cardWidth,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIndex === currentIndex
                          ? 'bg-[#8F4B2B] w-8'
                          : 'bg-gray-300 w-1.5'
                      }`}
                      aria-label={`Go to product ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
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

        {/* Show More Button (only if there are more products to load) */}
        {!loading && products.length > visibleCount && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="bg-[#8F4B2B] hover:bg-[#6f3a22] text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              {activeTab === "all"
                ? "Load More Products"
                : activeTab === "featured"
                ? "More Seasonal Special"
                : `More ${TABS.find(t => t.key === activeTab)?.label}`
              }
            </button>
          </div>
        )}

        {/* Product count indicator */}
        <div className="text-center mt-4">
          {!loading && (
            <span className="text-sm text-[#6E5B4E]">
              Showing {Math.min(visibleCount, products.length)} of {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          )}
        </div>
      </div>

      {/* Wave divider at the bottom */}
      <WaveDivider direction="bottom" color="#F8F4F0" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}