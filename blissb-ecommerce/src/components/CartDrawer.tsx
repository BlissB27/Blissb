"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useDeliveryStore, type DeliveryType } from "@/store/deliveryStore";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, Trash2, ShoppingBag, Clock, MapPin, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductImageSrc } from "@/lib/productImage";

const DELIVERY_TYPE_OPTIONS: { type: DeliveryType; label: string; Icon: typeof Clock }[] = [
  { type: "shipping", label: "Shipping", Icon: Clock },
  { type: "delivery", label: "Delivery", Icon: MapPin },
  { type: "pickup", label: "Pickup", Icon: ShoppingBag },
];

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    clearCart,
    getShippingInfo,
    getMinimumOrderInfo
  } = useCartStore();

  const { selectedType, setDeliveryType } = useDeliveryStore();

  const shippingInfo = getShippingInfo();
  const orderInfo = getMinimumOrderInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-bg z-50 shadow-xl"
          >
        <div className="flex flex-col h-full">
          {/* Minimum order warning */}
          {items.length > 0 && !orderInfo.hasMinimumOrder && (
            <div className="bg-brand-accent/30 p-3 text-center">
              <p className="text-brand-brown text-sm">
                Your cart subtotal must be at least ${orderInfo.minimumRequired.toFixed(2)} to check out (currently ${orderInfo.currentTotal.toFixed(2)}).
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-brand-bg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-brown" />
              <h2 className="text-lg font-semibold text-brand-brown">
                Your Cart
              </h2>
              {items.length > 0 && (
                <span className="bg-brand-brown text-white text-xs px-2 py-1 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-1 hover:bg-brand-border rounded-full"
            >
              <X className="w-5 h-5 text-brand-brown" />
            </button>
          </div>

          {/* Shipping info */}
          {items.length > 0 && (
            <div className="px-4 pb-4 bg-brand-bg">
              <div className="text-sm text-brand-brown mb-2 text-center">
                {shippingInfo.message}
              </div>
            </div>
          )}

          {/* Products section */}
          {items.length > 0 && (
            <div className="px-4 pb-2">
              <h3 className="text-brand-brown font-medium text-sm">Products</h3>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-brand-border rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-brand-brown" />
                </div>
                <p className="text-brand-muted mb-4 text-lg">Your cart is empty</p>
                <Button 
                  onClick={closeCart}
                  className="bg-brand-brown hover:bg-brand-brown-hover text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        duration: 0.2
                      }}
                      className="bg-white rounded-lg p-3 shadow-sm"
                    >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-brand-bg rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImageSrc(item.product.image)}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-brand-text text-sm mb-1">
                          {item.product.name}
                        </h4>
                        {item.flavor && (
                          <p className="text-xs text-brand-brown mb-1">
                            Flavor: {item.flavor}
                          </p>
                        )}
                        {item.boxFlavors && item.boxFlavors.length > 0 && (
                          <p className="text-xs text-brand-brown mb-1">
                            Flavors: {item.boxFlavors.map(f => `${f.flavor} x${f.quantity}`).join(', ')}
                          </p>
                        )}
                        {item.customMessage && (
                          <p className="text-xs text-brand-success italic mb-1 bg-brand-success/5 px-2 py-1 rounded">
                            "{item.customMessage}"
                          </p>
                        )}
                        {item.product.description && (
                          <p className="text-xs text-brand-muted mb-2 line-clamp-2">
                            {item.product.description}
                          </p>
                        )}
                        <p className="text-brand-brown font-semibold text-lg">
                          ${(item.product.price * item.quantity).toFixed(0)}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start p-1 hover:bg-brand-bg rounded text-brand-brown"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls - box items have a fixed quantity from their flavor split */}
                    {!item.boxFlavors && (
                      <div className="flex flex-col items-center mt-3 gap-1">
                        <div className="flex items-center bg-brand-bg rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-brand-border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-brand-brown" />
                          </button>

                          <span className="px-4 py-2 text-brand-text font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-brand-border rounded-full"
                          >
                            <Plus className="w-4 h-4 text-brand-brown" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Allergy Warning */}
          {items.length > 0 && (
            <div className="px-4 pb-2">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-orange-800">
                    <p className="font-medium mb-1">Allergy Warning</p>
                    <p>All products may contain tree nuts and food allergens. Please review our allergen information before ordering.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="bg-white border-t p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-brand-brown text-lg">Subtotal</span>
                <span className="text-brand-text font-bold text-2xl">
                  ${getTotalPrice().toFixed(0)}
                </span>
              </div>

              <p className="text-xs text-brand-muted text-center">
                Shipping, taxes, and discounts calculated at checkout
              </p>

              {/* Delivery Options */}
              <div className="grid grid-cols-3 gap-2">
                {DELIVERY_TYPE_OPTIONS.map(({ type, label, Icon }) => {
                  const isSelected = selectedType === type;
                  const feeLabel =
                    type === "shipping"
                      ? shippingInfo.shippingCost > 0 ? `$${shippingInfo.shippingCost}` : "Free"
                      : type === "pickup"
                      ? "Free"
                      : "At checkout";

                  return (
                    <button
                      key={type}
                      onClick={() => setDeliveryType(type)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-brand-brown text-white'
                          : 'border border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      {label}
                      <span className="text-xs opacity-80">{feeLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Delivery Selection Notice */}
              {selectedType === 'delivery' && (
                <div className="text-center text-xs text-brand-muted bg-brand-bg p-2 rounded-md">
                  You&apos;ll enter your address and see the exact delivery fee at checkout
                </div>
              )}

              {/* Continue Button */}
              <Button
                className="w-full bg-brand-success hover:bg-brand-success-hover text-white font-medium py-3 rounded-md"
                size="lg"
                disabled={!orderInfo.hasMinimumOrder}
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
              >
                Continue
              </Button>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full text-sm text-brand-brown hover:text-brand-brown-hover underline"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
