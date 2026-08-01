"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, X, ShoppingBag, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useCartStore } from "@/store/cartStore";
import { getProductsByCategoryAsync, type Product } from "@/data/products";

const MIN_COOKIES = 4;

type FlyingItem = {
  id: number;
  image: string;
  rect: DOMRect;
  deltaX: number;
  deltaY: number;
};

export function CookieBoxBuilder() {
  const { addItem } = useCartStore();
  const [cookies, setCookies] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const boxPanelRef = useRef<HTMLDivElement>(null);
  const flyIdRef = useRef(0);

  useEffect(() => {
    getProductsByCategoryAsync("cookies")
      .then(setCookies)
      .catch((error) => {
        console.error("Error loading cookies for the box builder:", error);
        setCookies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const lines = useMemo(
    () =>
      Object.entries(selections)
        .map(([id, quantity]) => ({ product: cookies.find((c) => c.id === id), quantity }))
        .filter((line): line is { product: Product; quantity: number } => !!line.product && line.quantity > 0),
    [selections, cookies]
  );

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const totalUnits = lines.reduce((sum, line) => sum + line.quantity, 0);
  const progress = Math.min(totalUnits / MIN_COOKIES, 1) * 100;
  const meetsMinimum = totalUnits >= MIN_COOKIES;

  const addOne = (productId: string, cardEl?: HTMLElement | null) => {
    setErrorMessage(null);
    setSelections((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));

    if (cardEl && boxPanelRef.current) {
      const imgEl = cardEl.querySelector("img");
      const rect = (imgEl ?? cardEl).getBoundingClientRect();
      const endRect = boxPanelRef.current.getBoundingClientRect();
      const product = cookies.find((c) => c.id === productId);
      if (product && rect.width > 0) {
        const id = flyIdRef.current++;
        const deltaX = endRect.left + endRect.width / 2 - (rect.left + rect.width / 2);
        const deltaY = endRect.top + 40 - (rect.top + rect.height / 2);
        setFlyingItems((prev) => [...prev, { id, image: product.image, rect, deltaX, deltaY }]);
        setTimeout(() => {
          setFlyingItems((prev) => prev.filter((f) => f.id !== id));
        }, 650);
      }
    }
  };

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>, cookieId: string) => {
    const cardEl = e.currentTarget.closest("[data-cookie-card]") as HTMLElement | null;
    addOne(cookieId, cardEl);
    return true;
  };

  const removeOne = (productId: string) => {
    setSelections((prev) => {
      const current = prev[productId] ?? 0;
      if (current <= 1) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const removeAll = (productId: string) => {
    setSelections((prev) => {
      const { [productId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleAddToCart = () => {
    if (lines.length === 0 || !meetsMinimum) return false;
    setErrorMessage(null);

    for (const line of lines) {
      const result = addItem(line.product, { quantity: line.quantity });
      if (!result.success) {
        setErrorMessage(result.error ?? `Couldn't add ${line.product.name} to your cart.`);
        return false;
      }
    }

    setSelections({});
    return true;
  };

  return (
    <>
      {/* Flying-to-box animation, rendered above everything else */}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: item.deltaX, y: item.deltaY, scale: 0.15, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            style={{
              position: "fixed",
              top: item.rect.top,
              left: item.rect.left,
              width: item.rect.width,
              height: item.rect.height,
            }}
            className="pointer-events-none z-50 overflow-hidden rounded-xl"
          >
            <Image src={item.image} alt="" fill className="object-cover" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-2">
          Build Your Own Cookie Box
        </h2>
        <p className="text-brand-muted max-w-xl mx-auto">
          Mix and match every flavor we bake. Pick as many as you like, and we&apos;ll box them up fresh, made your way.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left: every cookie flavor in the catalog */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="p-3">
                  <Skeleton className="aspect-square rounded-xl mb-3" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-8" />
                </div>
              ))
            : cookies.map((cookie) => {
                const qty = selections[cookie.id] ?? 0;
                return (
                  <div
                    key={cookie.id}
                    data-cookie-card
                    className="group flex flex-col rounded-2xl border border-brand-border bg-white p-3 transition-shadow duration-200 hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-bg">
                      <Image
                        src={cookie.image}
                        alt={cookie.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 20vw"
                      />
                      {qty > 0 && (
                        <span className="absolute top-2 right-2 rounded-full bg-brand-success px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                          {qty} in box
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 pt-3">
                      <h3 className="text-sm font-medium text-brand-text line-clamp-1">{cookie.name}</h3>
                      <AddToCartButton
                        size="sm"
                        className="mt-auto w-full"
                        onAdd={(e) => handleAddClick(e, cookie.id)}
                      >
                        <span className="flex w-full items-center justify-between">
                          <span>Add</span>
                          <span>${cookie.price.toFixed(2)}</span>
                        </span>
                      </AddToCartButton>
                    </div>
                  </div>
                );
              })}

          {!loading && cookies.length === 0 && (
            <p className="col-span-full text-center text-brand-muted py-12">
              We&apos;re updating our cookie selection — check back soon!
            </p>
          )}
        </div>

        {/* Right: the box being built */}
        <div ref={boxPanelRef} className="lg:sticky lg:top-48 rounded-2xl border border-brand-border bg-brand-bg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-brand-brown" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-brand-text">Your Box</h3>
            {totalUnits > 0 && (
              <span className="ml-auto text-sm text-brand-muted">{totalUnits} {totalUnits === 1 ? "cookie" : "cookies"}</span>
            )}
          </div>

          {/* Minimum-order progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
              <span>Minimum to order</span>
              <span>{Math.min(totalUnits, MIN_COOKIES)} of {MIN_COOKIES}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-border">
              <motion.div
                className="h-full rounded-full bg-brand-success"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <AnimatePresence>
              {meetsMinimum && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand-success"
                >
                  <PartyPopper className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Nice! You&apos;ve hit the minimum to order.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {lines.length === 0 ? (
            <p className="text-sm text-brand-muted py-6 text-center">
              Add cookies from the left to start building your box.
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              <AnimatePresence initial={false}>
                {lines.map(({ product, quantity }) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-brand-border">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-brand-text line-clamp-1">{product.name}</p>
                      <p className="text-xs text-brand-muted">${product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center border border-brand-border rounded-md bg-white">
                      <Button
                        onClick={() => removeOne(product.id)}
                        aria-label={`Remove one ${product.name}`}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-sm hover:bg-brand-bg"
                      >
                        <Minus className="h-3 w-3" strokeWidth={1.75} />
                      </Button>
                      <span className="w-5 text-center text-xs text-brand-text">{quantity}</span>
                      <Button
                        onClick={() => addOne(product.id)}
                        aria-label={`Add one more ${product.name}`}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-sm hover:bg-brand-bg"
                      >
                        <Plus className="h-3 w-3" strokeWidth={1.75} />
                      </Button>
                    </div>
                    <button
                      onClick={() => removeAll(product.id)}
                      aria-label={`Remove ${product.name} from box`}
                      className="text-brand-muted hover:text-brand-brown-hover"
                    >
                      <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="border-t border-brand-border pt-4 mb-4 flex items-center justify-between">
            <span className="font-medium text-brand-text">Subtotal</span>
            <span className="text-lg font-bold text-brand-brown">${subtotal.toFixed(2)}</span>
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-600 mb-3">
              {errorMessage}
            </p>
          )}

          <AddToCartButton
            onAdd={handleAddToCart}
            disabled={lines.length === 0 || !meetsMinimum}
            className="w-full"
            size="lg"
          >
            Add Box to Cart
          </AddToCartButton>
          {!meetsMinimum && (
            <p className="text-xs text-brand-muted text-center mt-2">
              Add {MIN_COOKIES - totalUnits} more {MIN_COOKIES - totalUnits === 1 ? "cookie" : "cookies"} to check out.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
