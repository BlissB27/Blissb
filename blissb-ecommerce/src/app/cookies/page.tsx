
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategoryAsync } from "@/data/products";
import { CalendarClock } from "lucide-react";

export default async function CookiesPage() {
  let cookieProducts = [];
  try {
    cookieProducts = await getProductsByCategoryAsync('cookies');
    console.log('Cookies products found:', cookieProducts.length);
  } catch (error) {
    console.error('Error fetching cookies:', error);
    cookieProducts = [];
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CalendarClock className="text-[#8F4B2B] w-8 h-8"/>
            <h1 className="text-3xl md:text-4xl font-bold text-[#8F4B2B]">
              Our Cookie Collection
            </h1>
          </div>
          <p className="text-[#6E5B4E] max-w-2xl mx-auto">
            Handcrafted with premium ingredients and baked fresh to order. 
            Remember: minimum 4 cookies total required per order.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {cookieProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {cookieProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#F8F4F0] rounded-full flex items-center justify-center">
              <CalendarClock className="w-12 h-12 text-[#8F4B2B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B2A22] mb-4">
              No Cookies Available
            </h2>
            <p className="text-[#6E5B4E] mb-6">
              We're currently updating our cookie selection. Check back soon!
            </p>
          </div>
        )}

        {/* Product Count */}
        <div className="text-center mt-8">
          <span className="text-sm text-[#6E5B4E]">
            Showing {cookieProducts.length} cookie {cookieProducts.length === 1 ? 'variety' : 'varieties'}
          </span>
        </div>

        {/* Cookie Info Section */}
        <section className="mt-16 bg-[#F8F4F0] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍪</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Freshly Baked</h3>
              <p className="text-sm text-[#6E5B4E]">
                Made to order and shipped fresh every Monday for optimal taste and texture.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Minimum Order</h3>
              <p className="text-sm text-[#6E5B4E]">
                4 cookies minimum per order. Mix and match any flavors you like!
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Premium Quality</h3>
              <p className="text-sm text-[#6E5B4E]">
                Made with high-quality ingredients and traditional baking methods.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}