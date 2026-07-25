"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useDeliveryStore } from "@/store/deliveryStore";
import { useHydrated } from "@/hooks/useHydrated";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, ArrowRight, Lock, Phone, Truck} from "lucide-react";
import { DeliverySelector } from "@/components/DeliverySelector";
import { calculateProcessingFee } from "@/lib/orderFees";
import { getProductImageSrc } from "@/lib/productImage";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    items,
    getTotalPrice,
    getShippingInfo,
    getMinimumOrderInfo
  } = useCartStore();

  const {
    selectedType,
    selectedZipCode,
    isConfirmed,
    isValidSelection,
    getDeliveryFee
  } = useDeliveryStore();

  const shippingInfo = getShippingInfo();
  const orderInfo = getMinimumOrderInfo();

  // Calcular delivery fee dinámicamente
  const getDeliveryFeeForType = () => {
    if (selectedType === 'shipping') {
      return shippingInfo.shippingCost; // $15 por docena de galletas
    } else if (selectedType === 'delivery') {
      return getDeliveryFee(selectedZipCode); // $0 o $20 basado en zip code
    } else if (selectedType === 'pickup') {
      return 0; // Pickup siempre gratis
    }
    return 0;
  };

  const deliveryFee = getDeliveryFeeForType();
  const subtotal = getTotalPrice();
  const processingFee = calculateProcessingFee(subtotal + deliveryFee);
  const finalTotal = subtotal + deliveryFee + processingFee;

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
      if (!orderInfo.hasMinimumOrder) {
        console.log("Order below minimum, redirecting to home");
        router.push('/');
        return;
      }
    }, 500); // Give 500ms for everything to load

    return () => clearTimeout(timer);
  }, [hydrated, items.length, orderInfo.hasMinimumOrder, router]);

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
  if (items.length === 0 || !orderInfo.hasMinimumOrder) {
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
                  <img
                    src={getProductImageSrc(item.product.image)}
                    alt={item.product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-[#3B2A22]">
                    {item.product.name}
                  </h3>
                  {item.flavor && (
                    <p className="text-sm text-[#8F4B2B]">Flavor: {item.flavor}</p>
                  )}
                  {item.boxFlavors && item.boxFlavors.length > 0 && (
                    <p className="text-sm text-[#8F4B2B]">
                      Flavors: {item.boxFlavors.map(f => `${f.flavor} x${f.quantity}`).join(', ')}
                    </p>
                  )}
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

          {/* Delivery Method Info */}
          <div className="bg-[#8F4B2B]/10 border border-[#8F4B2B]/20 rounded-lg p-4 mb-4">
            <p className="text-[#8F4B2B] text-center">
              {selectedType === 'shipping' && shippingInfo.totalCookies > 0
                ? shippingInfo.message
                : selectedType === 'delivery'
                ? `Local delivery ${deliveryFee === 0 ? '(Free to your area!)' : `($${deliveryFee} to your area)`}`
                : selectedType === 'pickup'
                ? 'Pickup at bakery location (Free)'
                : 'Please select delivery method'
              }
            </p>
          </div>

          {/* Totals */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6E5B4E]">Subtotal:</span>
              <span className="font-medium text-[#3B2A22]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6E5B4E]">
                {selectedType === 'shipping' ? 'Shipping:' :
                 selectedType === 'delivery' ? 'Delivery:' :
                 selectedType === 'pickup' ? 'Pickup:' : 'Delivery:'}
              </span>
              <span className="font-medium text-[#3B2A22]">
                {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6E5B4E]">Fees:</span>
              <span className="font-medium text-[#3B2A22]">
                ${processingFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span className="text-[#3B2A22]">Total:</span>
              <span className="text-[#8F4B2B]">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Selection */}
        <Card className="bg-white p-6 mb-6">
          <DeliverySelector
            showConfirmation={true}
            onConfirm={() => {
              // Optional: Add any additional logic when delivery is confirmed
              console.log('Delivery method confirmed');
            }}
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/checkout')}
            className="w-full bg-[#1E7A31] hover:bg-[#166426] text-white font-medium py-4 text-lg"
            size="lg"
            disabled={!isValidSelection() || !isConfirmed || !orderInfo.hasMinimumOrder}
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {!orderInfo.hasMinimumOrder && (
            <div className="text-center text-sm text-[#6E5B4E] bg-yellow-50 p-3 rounded-md border border-yellow-200">
              Your cart subtotal must be at least ${orderInfo.minimumRequired.toFixed(2)} to check out (currently ${orderInfo.currentTotal.toFixed(2)}).
            </div>
          )}

          {orderInfo.hasMinimumOrder && (!isValidSelection() || !isConfirmed) && (
            <div className="text-center text-sm text-[#6E5B4E] bg-yellow-50 p-3 rounded-md border border-yellow-200">
              Please confirm your delivery method selection to proceed
            </div>
          )}

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
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-[#6E5B4E]">
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            <span>Secure checkout</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>Fast delivery</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
