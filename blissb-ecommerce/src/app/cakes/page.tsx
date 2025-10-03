
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategoryAsync } from "@/data/products";
import { Cake } from "lucide-react";

export default async function CakesPage() {
  let cakeProducts = [];
  try {
    cakeProducts = await getProductsByCategoryAsync('cakes');
  } catch (error) {
    console.error('Error fetching cakes:', error);
    cakeProducts = [];
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cake className="text-[#8F4B2B] w-8 h-8"/>
            <h1 className="text-3xl md:text-4xl font-bold text-[#8F4B2B]">
              Our Cakes Collection
            </h1>
          </div>
          <p className="text-[#6E5B4E] max-w-2xl mx-auto">
            Custom-made cakes with multiple flavor options. Perfect for celebrations, 
            birthdays, and special occasions. Remember to select your preferred flavor!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cakeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {cakeProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#F8F4F0] rounded-full flex items-center justify-center">
              <Cake className="w-12 h-12 text-[#8F4B2B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B2A22] mb-4">
              No Cakes Available
            </h2>
            <p className="text-[#6E5B4E] mb-6">
              We're currently updating our cake selection. Check back soon!
            </p>
          </div>
        )}

        {/* Product Count */}
        <div className="text-center mt-8">
          <span className="text-sm text-[#6E5B4E]">
            Showing {cakeProducts.length} cake {cakeProducts.length === 1 ? 'option' : 'options'}
          </span>
        </div>

        {/* Cake Info Section */}
        <section className="mt-16 bg-[#F8F4F0] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎂</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Custom Flavors</h3>
              <p className="text-sm text-[#6E5B4E]">
                Choose from multiple flavor options for each cake. Each flavor is carefully crafted for the perfect taste.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Advance Notice</h3>
              <p className="text-sm text-[#6E5B4E]">
                Custom cakes require 24-48 hours advance notice for preparation and decoration.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👩‍🍳</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Handcrafted</h3>
              <p className="text-sm text-[#6E5B4E]">
                Each cake is individually crafted by our skilled bakers using premium ingredients and techniques.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}