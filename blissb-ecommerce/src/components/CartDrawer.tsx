"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, Cookie, CakeSlice, Dessert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductImageSrc } from "@/lib/productImage";

const CATEGORY_LINKS = [
  { href: "/cookies", label: "Cookies", Icon: Cookie },
  { href: "/cakes", label: "Cakes", Icon: CakeSlice },
  { href: "/desserts", label: "Desserts", Icon: Dessert },
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
    getMinimumOrderInfo
  } = useCartStore();

  const orderInfo = getMinimumOrderInfo();

  const decrement = (item: CartItem) => {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

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
            className="fixed right-4 top-4 bottom-4 w-full max-w-md bg-brand-bg z-50 shadow-xl rounded-2xl overflow-hidden"
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
          <div className="flex items-center justify-between px-4 py-4 bg-brand-bg border-b border-brand-border">
            <div className="flex items-center gap-2 ml-2">
              <h2 className="text-lg font-semibold text-brand-brown">
                Cart
              </h2>
              {items.length > 0 && (
                <span className="bg-brand-brown text-white text-xs px-2 py-1 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-1 mr-2 hover:bg-brand-border rounded-full"
            >
              <X className="w-5 h-5 text-brand-brown" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-brand-text text-lg font-medium mb-1">Your cart is currently empty.</p>
                <p className="text-brand-muted text-sm mb-6">
                  Not sure where to start? Try one of our fan favorites:
                </p>

                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {CATEGORY_LINKS.map(({ href, label, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeCart}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-brand-border text-brand-brown hover:bg-brand-brown hover:text-white transition-colors"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-1">
                        <div className="flex items-center gap-3 bg-white rounded-lg p-4 pr-5 shadow-md">
                          {/* Product Image */}
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-brand-bg">
                            <img
                              src={getProductImageSrc(item.product.image)}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="min-w-0 flex-[2]">
                            <p className="text-sm font-medium text-brand-text line-clamp-1">
                              {item.product.name}
                            </p>
                            {item.flavor && (
                              <p className="text-xs text-brand-brown line-clamp-1 capitalize">
                                Flavor: {item.flavor}
                              </p>
                            )}
                            {item.boxFlavors && item.boxFlavors.length > 0 && (
                              <p className="text-xs text-brand-brown line-clamp-1 capitalize">
                                Flavors: {item.boxFlavors.map(f => f.flavor).join(', ')}
                              </p>
                            )}
                            <p className="text-xs text-brand-muted">${item.product.price.toFixed(2)} each</p>
                          </div>

                          {/* Quantity Controls - locked only for fixed-size boxes or multi-flavor splits */}
                          <div className="flex-1 flex justify-center">
                            {item.boxFlavors && (item.boxFlavors.length > 1 || item.product.isSoldInBox) ? (
                              <span className="text-xs text-brand-muted">x{item.quantity}</span>
                            ) : (
                              <div className="flex items-center border border-brand-border rounded-md bg-white">
                                <Button
                                  onClick={() => decrement(item)}
                                  aria-label={`Remove one ${item.product.name}`}
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-sm hover:bg-brand-bg"
                                >
                                  <Minus className="h-3 w-3" strokeWidth={1.75} />
                                </Button>
                                <span className="w-5 text-center text-xs text-brand-text">{item.quantity}</span>
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label={`Add one more ${item.product.name}`}
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-sm hover:bg-brand-bg"
                                >
                                  <Plus className="h-3 w-3" strokeWidth={1.75} />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.product.name} from cart`}
                            className="flex-shrink-0 text-brand-muted hover:text-brand-brown-hover"
                          >
                            <X className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="bg-brand-bg border-t border-brand-border px-5 py-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-text">Subtotal</span>
                <span className="text-lg font-bold text-brand-brown">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-brand-muted text-center">
                Taxes, delivery, shipping or pickup calculated at checkout
              </p>

              {/* Continue Button */}
              <Button
                className="w-full"
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
