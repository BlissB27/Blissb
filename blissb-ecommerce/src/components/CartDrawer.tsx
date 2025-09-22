"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Plus, Minus, Trash2, ShoppingBag, Clock, MapPin } from "lucide-react";
import Image from "next/image";

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    clearCart,
    getFreeShippingProgress,
    getMinimumCookiesInfo
  } = useCartStore();

  const shippingProgress = getFreeShippingProgress();
  const cookiesInfo = getMinimumCookiesInfo();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F8F4F0] z-50 shadow-xl animate-in slide-in-from-right-full duration-300">
        <div className="flex flex-col h-full">
          {/* Minimum cookies warning */}
          {items.length > 0 && !cookiesInfo.hasEnoughCookies && (
            <div className="bg-[#EFCCB8] border-l-4 border-[#C08552] p-3 text-center">
              <p className="text-[#8F4B2B] text-sm">
                Your cart must contain a minimum of {cookiesInfo.minimumRequired} cookies.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#F8F4F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8F4B2B]" />
              <h2 className="text-lg font-semibold text-[#8F4B2B]">
                Your Cart
              </h2>
              {items.length > 0 && (
                <span className="bg-[#8F4B2B] text-white text-xs px-2 py-1 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-1 hover:bg-[#E6D7CB] rounded-full"
            >
              <X className="w-5 h-5 text-[#8F4B2B]" />
            </button>
          </div>

          {/* Free shipping progress */}
          {items.length > 0 && (
            <div className="px-4 pb-4 bg-[#F8F4F0]">
              <div className="text-sm text-[#8F4B2B] mb-2">
                {shippingProgress.isEligible ? (
                  <span className="text-[#1E7A31] font-medium">
                    🎉 You've got free shipping!
                  </span>
                ) : (
                  <>
                    You're <span className="font-semibold">${shippingProgress.remaining.toFixed(0)}</span> away from getting{" "}
                    <span className="font-semibold text-[#1E7A31]">free shipping</span>
                  </>
                )}
              </div>
              <Progress 
                value={shippingProgress.percentage} 
                className="h-2 bg-[#E6D7CB]"
              />
            </div>
          )}

          {/* Products section */}
          {items.length > 0 && (
            <div className="px-4 pb-2">
              <h3 className="text-[#8F4B2B] font-medium text-sm">Products</h3>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#E6D7CB] rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-[#8F4B2B]" />
                </div>
                <p className="text-[#6E5B4E] mb-4 text-lg">Your cart is empty</p>
                <Button 
                  onClick={closeCart}
                  className="bg-[#8F4B2B] hover:bg-[#6f3a22] text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-[#F8F4F0] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#3B2A22] text-sm mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-[#6E5B4E] mb-2">
                          Descripción del producto
                        </p>
                        <p className="text-[#8F4B2B] font-semibold text-lg">
                          ${(item.product.price * item.quantity).toFixed(0)}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start p-1 hover:bg-[#F8F4F0] rounded text-[#8F4B2B]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center mt-3">
                      <div className="flex items-center bg-[#F8F4F0] rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-[#E6D7CB] rounded-full"
                          disabled={item.quantity <= (item.product.category === 'cookies' ? 4 : 1)}
                        >
                          <Minus className="w-4 h-4 text-[#8F4B2B]" />
                        </button>
                        
                        <span className="px-4 py-2 text-[#3B2A22] font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-[#E6D7CB] rounded-full"
                        >
                          <Plus className="w-4 h-4 text-[#8F4B2B]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="bg-white border-t p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-[#8F4B2B] text-lg">Subtotal</span>
                <span className="text-[#3B2A22] font-bold text-2xl">
                  ${getTotalPrice().toFixed(0)}
                </span>
              </div>

              <p className="text-xs text-[#6E5B4E] text-center">
                Shipping, taxes, and discounts calculated at checkout
              </p>

              {/* Delivery Options */}
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center justify-center p-3 bg-[#8F4B2B] text-white rounded-lg text-xs font-medium">
                  <Clock className="w-5 h-5 mb-1" />
                  Shipping
                </button>
                <button className="flex flex-col items-center justify-center p-3 border border-[#8F4B2B] text-[#8F4B2B] rounded-lg text-xs font-medium hover:bg-[#8F4B2B] hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 mb-1" />
                  Schedule Delivery
                </button>
                <button className="flex flex-col items-center justify-center p-3 border border-[#8F4B2B] text-[#8F4B2B] rounded-lg text-xs font-medium hover:bg-[#8F4B2B] hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5 mb-1" />
                  Schedule Pickup
                </button>
              </div>

              {/* Continue Button */}
              <Button 
                className="w-full bg-[#1E7A31] hover:bg-[#166426] text-white font-medium py-3 rounded-full"
                size="lg"
                disabled={!cookiesInfo.hasEnoughCookies}
                onClick={() => {
                  closeCart();
                  window.location.href = '/order-confirmation';
                }}
              >
                Continue
              </Button>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full text-sm text-[#8F4B2B] hover:text-[#6f3a22] underline"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}