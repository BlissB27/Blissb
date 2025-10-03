
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategoryAsync, type Product } from "@/data/products";
import { IceCream } from "lucide-react";

export default async function DessertsPage() {
  let dessertProducts: Product[] = [];
  try {
    dessertProducts = await getProductsByCategoryAsync('desserts');
  } catch (error) {
    console.error('Error fetching desserts:', error);
    dessertProducts = [];
  }

  return ( 
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IceCream className="text-[#8F4B2B] w-8 h-8"/>
            <h1 className="text-3xl md:text-4xl font-bold text-[#8F4B2B]">
              Gourmet Desserts
            </h1>
          </div>
          <p className="text-[#6E5B4E] max-w-2xl mx-auto">
            Indulgent desserts crafted with precision and care. From classic favorites 
            to innovative creations, each dessert is a perfect ending to any meal.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dessertProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {dessertProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#F8F4F0] rounded-full flex items-center justify-center">
              <IceCream className="w-12 h-12 text-[#8F4B2B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B2A22] mb-4">
              No Desserts Available
            </h2>
            <p className="text-[#6E5B4E] mb-6">
              We're currently updating our dessert selection. Check back soon!
            </p>
          </div>
        )}

        {/* Product Count */}
        <div className="text-center mt-8">
          <span className="text-sm text-[#6E5B4E]">
            Showing {dessertProducts.length} dessert {dessertProducts.length === 1 ? 'option' : 'options'}
          </span>
        </div>

        {/* Desserts Info Section */}
        <section className="mt-16 bg-[#F8F4F0] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍮</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Individual Portions</h3>
              <p className="text-sm text-[#6E5B4E]">
                Perfect single servings designed for optimal enjoyment. Each dessert is portioned for the ideal experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Best Fresh</h3>
              <p className="text-sm text-[#6E5B4E]">
                Best consumed within 2-3 days of delivery. Store refrigerated and serve at room temperature.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFC596] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-[#3B2A22] mb-2">Premium Ingredients</h3>
              <p className="text-sm text-[#6E5B4E]">
                Made with authentic ingredients and traditional techniques for exceptional flavor and texture.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}