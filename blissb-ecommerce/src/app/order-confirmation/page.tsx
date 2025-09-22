"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHudrated";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    items, 
    getTotalPrice, 
    getFreeShippingProgress,
    getMinimumCookiesInfo 
  } = useCartStore();

  const shippingProgress = getFreeShippingProgress();
  const cookiesInfo = getMinimumCookiesInfo();

  // Wait for hydration and add delay before checking
  useEffect(() => {
    if (!hydrated) return;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Only redirect if cart is actually empty after hydration
      if (items.length === 0) {
        console.log("Cart is empty, redirecting to home");
        router.push('/');
        return;
      }
      
      // Only redirect if doesn't meet minimum after hydration
      if (!cookiesInfo.hasEnoughCookies) {
        console.log("Not enough cookies, redirecting to home");
        router.push('/');
        return;
      }
    }, 500); // Give 500ms for everything to load
    
    return () => clearTimeout(timer);
  }, [hydrated, items.length, cookiesInfo.hasEnoughCookies, router]);

  // Show loading while checking
  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F4F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8F4B2B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6E5B4E]">Loading your order...</p>
        </div>
      </div>
    );
  }

  // Show nothing if redirecting
  if (items.length === 0 || !cookiesInfo.hasEnoughCookies) {
    return (
      <div className="min-h-screen bg-[#F8F4F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6E5B4E]">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4F0] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1E7A31] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#3B2A22] mb-2">
            Order Confirmation
          </h1>
          <p className="text-[#6E5B4E]">
            Please review your order before proceeding to checkout
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="bg-white p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-[#8F4B2B]" />
            <h2 className="text-xl font-semibold text-[#3B2A22]">
              Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-[#F8F4F0] rounded-lg">
                <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-[#3B2A22]">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-[#6E5B4E]">
                    Quantity: {item.quantity}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-[#8F4B2B]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Status */}
          {shippingProgress.isEligible ? (
            <div className="bg-[#1E7A31]/10 border border-[#1E7A31]/20 rounded-lg p-4 mb-4">
              <p className="text-[#1E7A31] font-medium text-center">
                🎉 Congratulations! Your order qualifies for FREE SHIPPING
              </p>
            </div>
          ) : (
            <div className="bg-[#8F4B2B]/10 border border-[#8F4B2B]/20 rounded-lg p-4 mb-4">
              <p className="text-[#8F4B2B] text-center">
                Add ${shippingProgress.remaining.toFixed(2)} more to get free shipping
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6E5B4E]">Subtotal:</span>
              <span className="font-medium text-[#3B2A22]">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6E5B4E]">Shipping:</span>
              <span className="font-medium text-[#3B2A22]">
                {shippingProgress.isEligible ? 'FREE' : 'Calculated at checkout'}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span className="text-[#3B2A22]">Total:</span>
              <span className="text-[#8F4B2B]">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#1E7A31] hover:bg-[#166426] text-white font-medium py-4 text-lg"
            size="lg"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full border-[#8F4B2B] text-[#8F4B2B] hover:bg-[#8F4B2B] hover:text-white font-medium py-4"
            size="lg"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-[#6E5B4E]">
          <p>
            🔒 Secure checkout • 🚚 Fast delivery • 📞 24/7 support
          </p>
        </div>
      </div>
    </div>
  );
}