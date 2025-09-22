"use client";

import { useState, useMemo } from "react";
import { CalendarClock } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, type Product } from "@/data/products";

type TabType = "featured" | "cookies" | "desserts" | "cakes";

const TABS = [
  { key: "featured" as TabType, label: "Special Offer" },
  { key: "cookies" as TabType, label: "Cookies" },
  { key: "desserts" as TabType, label: "Desserts" },
  { key: "cakes" as TabType, label: "Cakes" },
];

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("featured");

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case "featured":
        return PRODUCTS.filter(product => product.isNew || product.isOnOffer);
      case "cookies":
        return PRODUCTS.filter(product => product.category === "cookies");
      case "desserts":
        return PRODUCTS.filter(product => product.category === "desserts");
      case "cakes":
        return PRODUCTS.filter(product => product.category === "cakes");
      default:
        return PRODUCTS;
    }
  }, [activeTab]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CalendarClock className="text-[#8F4B2B] w-10 h-10"/>
            <span className="text-center text-2xl md:text-3xl font-bold text-[#8F4B2B]">
              We ship every Monday — fresh week, fresh treats!
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 p-1 bg-white rounded-lg ">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "text-white bg-[#8F4B2B]"
                    : "text-[#6E5B4E] hover:text-[#8F4B2B] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-[#6E5B4E] text-lg">
                No products found in this category
              </p>
              <button
                onClick={() => setActiveTab("featured")}
                className="mt-4 text-[#8F4B2B] hover:underline"
              >
                View featured products
              </button>
            </div>
          )}
        </div>

        {/* Show More Button (only if there are products) */}
        {filteredProducts.length > 0 && (
          <div className="text-center">
            <button className="bg-[#8F4B2B] hover:bg-[#6f3a22] text-white px-8 py-3 rounded-md font-medium transition-colors">
              {activeTab === "featured" ? "More Cookies" : `More ${TABS.find(t => t.key === activeTab)?.label}`}
            </button>
          </div>
        )}

        {/* Product count indicator */}
        <div className="text-center mt-4">
          <span className="text-sm text-[#6E5B4E]">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>
      </div>
    </section>
  );
}