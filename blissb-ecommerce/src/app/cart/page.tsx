'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, Minus, Pencil, Plus, X } from 'lucide-react';
import { useCartStore, type CartItem, CAKE_MESSAGE_MAX_LENGTH } from '@/store/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getProductImageSrc } from '@/lib/productImage';
import { validateCoupon } from '@/lib/coupons';
import { toSentenceCase } from '@/lib/text';
import { WaveDivider } from '@/components/WaveDivider';

export default function CartPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const {
    items,
    updateQuantity,
    removeItem,
    setItemMessage,
    getTotalPrice,
    getMinimumOrderInfo,
    appliedCoupon,
    setCoupon,
    clearCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  // Qué ítem tiene abierto el editor de mensaje en chocolate (solo uno a la vez).
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const orderInfo = getMinimumOrderInfo();
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percentOff / 100) * 100) / 100 : 0;

  // Once hydrated, an empty cart has nothing to review — send them shopping
  // instead of showing a blank review page.
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push('/');
    }
  }, [hydrated, items.length, router]);

  const decrement = (item: CartItem) => {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleApplyCoupon = () => {
    const result = validateCoupon(couponInput);
    if (result.valid) {
      setCoupon({ code: couponInput.trim().toUpperCase(), percentOff: result.percentOff });
      setCouponError(null);
    } else {
      setCouponError("That code isn't valid.");
    }
  };

  if (!hydrated || items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh] bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 mb-6">
          <h1 className="text-3xl font-bold text-brand-brown">Your Cart</h1>
        </motion.div>

        {!orderInfo.hasMinimumOrder && (
          <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 mb-6 text-sm text-yellow-800">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Your cart subtotal must be at least ${orderInfo.minimumRequired.toFixed(2)} to check out (currently $
              {orderInfo.currentTotal.toFixed(2)}).
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-20">
          {/* Items — 60% */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white rounded-xl border border-brand-border">
                    <div className="flex items-center gap-4 py-4 pl-4 pr-8">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-bg">
                        <img
                          src={getProductImageSrc(item.product.image)}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-brand-text">{item.product.name}</p>
                        {item.flavor && <p className="text-xs text-brand-brown">{toSentenceCase(item.flavor)}</p>}
                        {item.boxFlavors && item.boxFlavors.length === 1 && (
                          <p className="text-xs text-brand-brown">{toSentenceCase(item.boxFlavors[0].flavor)}</p>
                        )}
                        {item.boxFlavors && item.boxFlavors.length > 1 && (
                          <p className="text-xs text-brand-brown">
                            {item.boxFlavors.map((f) => toSentenceCase(f.flavor)).join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-brand-muted">${item.product.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center border border-brand-border rounded-md bg-white">
                        <Button
                          onClick={() => decrement(item)}
                          aria-label={`Remove one ${item.product.name}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-sm hover:bg-brand-bg"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </Button>
                        <span className="w-6 text-center text-sm text-brand-text">{item.quantity}</span>
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Add one more ${item.product.name}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-sm hover:bg-brand-bg"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </Button>
                      </div>

                      <p className="w-16 text-right font-semibold text-brand-text">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="flex-shrink-0 text-brand-muted hover:text-brand-brown-hover"
                      >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>

                    {/* Mensaje en chocolate — solo para cakes, se edita únicamente acá en /cart */}
                    {item.product.category === 'cakes' && (
                      <div className="border-t border-brand-border px-4 pb-3">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMessageId((prev) => (prev === item.id ? null : item.id))
                          }
                          aria-expanded={openMessageId === item.id}
                          className="flex w-full items-center gap-2 py-2.5 text-sm text-brand-brown hover:text-brand-brown-hover"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                          <span className="font-medium">
                            {item.message ? 'Message in chocolate' : 'Add a message in chocolate'}
                          </span>
                          {item.message && (
                            <span className="max-w-[45%] truncate text-brand-muted font-normal">
                              &ldquo;{item.message}&rdquo;
                            </span>
                          )}
                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform ${
                              openMessageId === item.id ? 'rotate-180' : ''
                            }`}
                            strokeWidth={1.75}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {openMessageId === item.id && (
                            <motion.div
                              key="message-editor"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="pb-1 pt-1">
                                <textarea
                                  value={item.message ?? ''}
                                  onChange={(e) => setItemMessage(item.id, e.target.value)}
                                  maxLength={CAKE_MESSAGE_MAX_LENGTH}
                                  rows={2}
                                  placeholder={'e.g. "Happy Birthday"'}
                                  className="w-full resize-none rounded-lg border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-brown focus:outline-none"
                                />
                                <div className="mt-1 flex items-center justify-between text-xs text-brand-muted">
                                  <span>Piped in chocolate on your cake.</span>
                                  <span>
                                    {(item.message?.length ?? 0)}/{CAKE_MESSAGE_MAX_LENGTH}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary — 40% */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-brand-border p-6 lg:sticky lg:top-8">
            {/* Line items */}
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <div>
                    <p className="text-brand-text">{item.product.name}</p>
                    <p className="text-xs text-brand-muted">Quantity: {item.quantity}</p>
                  </div>
                  <span className="flex-shrink-0 font-medium text-brand-text">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Discount code */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-brand-success/10 px-3 py-2 text-sm text-brand-success">
                  <span className="font-medium">
                    {appliedCoupon.code} applied — {appliedCoupon.percentOff}% off
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCoupon();
                      setCouponInput('');
                    }}
                    aria-label="Remove discount code"
                    className="text-brand-success hover:text-brand-success-hover"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError(null);
                      }}
                      placeholder="Discount code"
                      className="border-brand-border focus:border-brand-brown"
                    />
                    <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-brand-success">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-brand-muted text-center mt-3">
              Taxes, delivery, shipping or pickup calculated at checkout
            </p>

            <Separator className="my-4" />

            <Button
              className="w-full"
              size="lg"
              disabled={!orderInfo.hasMinimumOrder}
              onClick={() => router.push('/checkout')}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>

      <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />
    </div>
  );
}
