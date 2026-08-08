"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, X, ShoppingBag, PartyPopper, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FlavorConfirmDialog } from "@/components/FlavorConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cartStore";
import { getProductsByCategoryAsync, type Product } from "@/data/products";
import { toSentenceCase } from "@/lib/text";

const MIN_COOKIES = 4;
// Below this, the box panel is off in the normal document flow (after the
// whole cookie grid) instead of sticky — that's the point where the mobile
// bottom bar takes over as the box UI instead. Matches the lg: breakpoint
// already used for the desktop sticky panel.
const DESKTOP_BREAKPOINT_PX = 1024;

type FlyingItem = {
  id: number;
  image: string;
  rect: DOMRect;
  deltaX: number;
  deltaY: number;
};

// A cookie with its own `flavors` (e.g. a dipping-sauce choice) needs one
// picked before it can be added — a product can have several box lines if
// it's been added with different flavors, so lines are keyed by product+flavor.
type Selection = { productId: string; flavor?: string; quantity: number };
const selectionKey = (productId: string, flavor?: string) => (flavor ? `${productId}::${flavor}` : productId);

type BoxLine = { product: Product; flavor: string | undefined; quantity: number };

function BoxLineItem({
  line,
  onDecrement,
  onIncrement,
  onRemove,
}: {
  line: BoxLine;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}) {
  const { product, flavor, quantity } = line;
  return (
    <motion.div
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
        <p className="text-sm font-medium text-brand-text line-clamp-1">
          {product.name}
          {flavor && <span className="text-brand-muted"> — {toSentenceCase(flavor)}</span>}
        </p>
        <p className="text-xs text-brand-muted">${product.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center border border-brand-border rounded-md bg-white">
        <Button
          onClick={onDecrement}
          aria-label={`Remove one ${product.name}`}
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-brand-bg"
        >
          <Minus className="h-3 w-3" strokeWidth={1.75} />
        </Button>
        <span className="w-5 text-center text-xs text-brand-text">{quantity}</span>
        <Button
          onClick={onIncrement}
          aria-label={`Add one more ${product.name}`}
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-sm hover:bg-brand-bg"
        >
          <Plus className="h-3 w-3" strokeWidth={1.75} />
        </Button>
      </div>
      <button
        onClick={onRemove}
        aria-label={`Remove ${product.name} from box`}
        className="text-brand-muted hover:text-brand-brown-hover"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </motion.div>
  );
}

/** The progress bar + "hit the minimum" celebration — shared between the
 * desktop side panel and the mobile sticky bar, which only differ in bar
 * height and the label row wrapped around this by each caller. */
function MinimumProgressBar({
  progress,
  meetsMinimum,
  barClassName = "h-2",
}: {
  progress: number;
  meetsMinimum: boolean;
  barClassName?: string;
}) {
  return (
    <>
      <div className={`${barClassName} w-full overflow-hidden rounded-full bg-brand-border`}>
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
    </>
  );
}

/** The box's line-item list (or its empty state) — shared between the
 * desktop panel and the mobile expanded bar, which only differ in the
 * empty-state copy and their own wrapping container. */
function BoxLinesList({
  lines,
  emptyMessage,
  onDecrement,
  onIncrement,
  onRemove,
}: {
  lines: BoxLine[];
  emptyMessage: string;
  onDecrement: (key: string) => void;
  onIncrement: (productId: string, flavor: string | undefined) => void;
  onRemove: (key: string) => void;
}) {
  if (lines.length === 0) {
    return <p className="py-4 text-center text-sm text-brand-muted">{emptyMessage}</p>;
  }
  return (
    <AnimatePresence initial={false}>
      {lines.map((line) => (
        <BoxLineItem
          key={selectionKey(line.product.id, line.flavor)}
          line={line}
          onDecrement={() => onDecrement(selectionKey(line.product.id, line.flavor))}
          onIncrement={() => onIncrement(line.product.id, line.flavor)}
          onRemove={() => onRemove(selectionKey(line.product.id, line.flavor))}
        />
      ))}
    </AnimatePresence>
  );
}

export function CookieBoxBuilder() {
  const { addItem, getMinimumOrderInfo } = useCartStore();
  const [cookies, setCookies] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [flavorModalProduct, setFlavorModalProduct] = useState<Product | null>(null);
  const [modalFlavor, setModalFlavor] = useState<string | null>(null);
  const [showMinWarning, setShowMinWarning] = useState(false);
  const [mobileBarInSection, setMobileBarInSection] = useState(false);
  const [isMobileBoxOpen, setIsMobileBoxOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxPanelRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const modalCardElRef = useRef<HTMLElement | null>(null);
  const flyIdRef = useRef(0);

  useEffect(() => {
    getProductsByCategoryAsync("cookies")
      // Pre-made boxes (e.g. Mini Cookie Box) aren't an individual cookie
      // to mix into a custom box — they're their own whole product.
      .then((data) => setCookies(data.filter((product) => !product.isSoldInBox)))
      .catch((error) => {
        console.error("Error loading cookies for the box builder:", error);
        setCookies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Drives the mobile sticky box bar: visible only while any part of the
  // builder section is on screen above the strip the bar itself covers.
  // Computed directly off scroll position (rather than an
  // IntersectionObserver) since that's the one thing that has to stay in
  // lockstep with the scroll, even on a fast fling — an observer's rootMargin
  // trick can lag a beat behind and leave the bar hanging into the next
  // section.
  useEffect(() => {
    const BAR_CLEARANCE_PX = 150;
    let frame = 0;
    const update = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      // Both edges need the same clearance: without it on the bottom edge,
      // a bare sliver of the section (a few px, pinned at the very top of
      // the screen) was enough to count as "still visible" — even while the
      // rest of the screen had already scrolled well into the next section.
      setMobileBarInSection(rect.top < window.innerHeight - BAR_CLEARANCE_PX && rect.bottom > BAR_CLEARANCE_PX);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lines = useMemo(
    () =>
      Object.values(selections)
        .map((sel) => ({ product: cookies.find((c) => c.id === sel.productId), flavor: sel.flavor, quantity: sel.quantity }))
        .filter((line): line is BoxLine => !!line.product && line.quantity > 0),
    [selections, cookies]
  );

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const totalUnits = lines.reduce((sum, line) => sum + line.quantity, 0);
  const progress = Math.min(totalUnits / MIN_COOKIES, 1) * 100;
  const meetsMinimum = totalUnits >= MIN_COOKIES;
  const showMobileBar = mobileBarInSection && !loading && cookies.length > 0;

  const qtyForProduct = (productId: string) =>
    Object.values(selections)
      .filter((sel) => sel.productId === productId)
      .reduce((sum, sel) => sum + sel.quantity, 0);

  const addOne = (productId: string, flavor: string | undefined, cardEl?: HTMLElement | null) => {
    setErrorMessage(null);
    const key = selectionKey(productId, flavor);
    setSelections((prev) => ({
      ...prev,
      [key]: { productId, flavor, quantity: (prev[key]?.quantity ?? 0) + 1 },
    }));

    const isMobileLayout = typeof window !== "undefined" && window.innerWidth < DESKTOP_BREAKPOINT_PX;
    const targetEl = isMobileLayout ? mobileBarRef.current : boxPanelRef.current;

    if (cardEl && targetEl) {
      const imgEl = cardEl.querySelector("img");
      const rect = (imgEl ?? cardEl).getBoundingClientRect();
      const endRect = targetEl.getBoundingClientRect();
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

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>, cookie: Product): boolean => {
    const cardEl = e.currentTarget.closest("[data-cookie-card]") as HTMLElement | null;

    if (cookie.flavors && cookie.flavors.length > 0) {
      modalCardElRef.current = cardEl;
      setModalFlavor(null);
      setFlavorModalProduct(cookie);
      return false; // opens the flavor modal instead of a completed add
    }

    addOne(cookie.id, undefined, cardEl);
    return true;
  };

  const confirmFlavorModal = (): boolean => {
    if (!flavorModalProduct || !modalFlavor) return false;
    addOne(flavorModalProduct.id, modalFlavor, modalCardElRef.current);
    return true;
  };

  const removeOne = (key: string) => {
    setSelections((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: { ...existing, quantity: existing.quantity - 1 } };
    });
  };

  const removeAll = (key: string) => {
    setSelections((prev) => {
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const clearBox = () => {
    setErrorMessage(null);
    setSelections({});
  };

  const performAddToCart = (): boolean => {
    if (lines.length === 0) return false;
    setErrorMessage(null);

    for (const line of lines) {
      const result = addItem(line.product, { quantity: line.quantity, flavor: line.flavor });
      if (!result.success) {
        setErrorMessage(result.error ?? `Couldn't add ${line.product.name} to your cart.`);
        return false;
      }
    }

    setSelections({});
    return true;
  };

  // Below the box's own suggested minimum (4), adding is still allowed — it's
  // the site-wide $20 checkout minimum that actually matters, and the
  // customer might already be planning to add more from elsewhere. Only warn
  // if the cart would genuinely still be short of that after adding — if
  // they already have enough from other purchases, the warning would just be
  // noise (and wrong).
  const handleAddToCart = (): boolean => {
    if (lines.length === 0) return false;
    const { currentTotal, minimumRequired } = getMinimumOrderInfo();
    const wouldMeetSiteMinimum = currentTotal + subtotal >= minimumRequired;
    if (!meetsMinimum && !wouldMeetSiteMinimum) {
      setShowMinWarning(true);
      return false;
    }
    return performAddToCart();
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

      <div ref={sectionRef} className="pb-28 lg:pb-0">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-2">
            Build Your Own Cookie Box
          </h2>
          <p className="text-brand-muted max-w-xl mx-auto">
            Mix and match every flavor we bake. Fresh, boxed, and made your way.
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
                  const qty = qtyForProduct(cookie.id);
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
                          onAdd={(e) => handleAddClick(e, cookie)}
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

          {/* Right: the box being built — desktop/tablet only above lg; the
              mobile sticky bar below replaces it under that breakpoint. */}
          <div
            ref={boxPanelRef}
            className="hidden lg:block lg:sticky lg:top-48 rounded-2xl border border-brand-border bg-brand-bg p-6"
          >
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
              <MinimumProgressBar progress={progress} meetsMinimum={meetsMinimum} barClassName="h-2" />
            </div>

            <div className={lines.length > 0 ? "space-y-3 mb-4" : undefined}>
              <BoxLinesList
                lines={lines}
                emptyMessage="Add cookies from the left to start building your box."
                onDecrement={removeOne}
                onIncrement={addOne}
                onRemove={removeAll}
              />
            </div>

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
              disabled={lines.length === 0}
              className="w-full"
              size="lg"
            >
              Add Box to Cart
            </AddToCartButton>
            {!meetsMinimum && (
              <p className="text-xs text-brand-muted text-center mt-2">
                {MIN_COOKIES - totalUnits} more {MIN_COOKIES - totalUnits === 1 ? "cookie" : "cookies"} recommended for a full box.
              </p>
            )}
            {lines.length > 0 && (
              <button
                onClick={clearBox}
                className="w-full text-sm text-brand-brown hover:text-brand-brown-hover underline mt-3 text-center"
              >
                Clear Box
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky box bar — only below lg, only while the builder
          section is on screen. Collapsed it's a status row + always-visible
          CTA; tapping it expands the line-item list upward. */}
      <motion.div
        ref={mobileBarRef}
        initial={{ y: "100%" }}
        animate={{ y: showMobileBar ? "0%" : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ pointerEvents: showMobileBar ? "auto" : "none" }}
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border-t border-brand-border bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
      >
        <button
          type="button"
          onClick={() => setIsMobileBoxOpen((open) => !open)}
          aria-expanded={isMobileBoxOpen}
          className="flex w-full items-center gap-3 px-4 py-3"
        >
          <ShoppingBag className="h-5 w-5 flex-shrink-0 text-brand-brown" strokeWidth={1.75} aria-hidden="true" />
          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-brand-text">
                {totalUnits > 0 ? `${totalUnits} ${totalUnits === 1 ? "cookie" : "cookies"} · $${subtotal.toFixed(2)}` : "Your Box"}
              </span>
              <span className="flex-shrink-0 text-xs text-brand-muted">
                {Math.min(totalUnits, MIN_COOKIES)} of {MIN_COOKIES}
              </span>
            </div>
            <div className="mt-1.5">
              <MinimumProgressBar progress={progress} meetsMinimum={meetsMinimum} barClassName="h-1.5" />
            </div>
          </div>
          {isMobileBoxOpen ? (
            <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-muted" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ChevronUp className="h-5 w-5 flex-shrink-0 text-brand-muted" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isMobileBoxOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-brand-border"
            >
              <div className="max-h-[45vh] space-y-3 overflow-y-auto px-4 py-3">
                <BoxLinesList
                  lines={lines}
                  emptyMessage="Add cookies to start building your box."
                  onDecrement={removeOne}
                  onIncrement={addOne}
                  onRemove={removeAll}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-brand-border px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          {errorMessage && (
            <p role="alert" className="mb-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}
          <AddToCartButton onAdd={handleAddToCart} disabled={lines.length === 0} className="w-full" size="lg">
            Add Box to Cart
          </AddToCartButton>
          {lines.length > 0 && (
            <button
              onClick={clearBox}
              className="w-full text-sm text-brand-brown hover:text-brand-brown-hover underline mt-2 text-center"
            >
              Clear Box
            </button>
          )}
        </div>
      </motion.div>

      {/* Flavor modal — only cookies with their own flavors (e.g. a dipping
          sauce choice) need this before they can be added to the box. */}
      <FlavorConfirmDialog
        open={!!flavorModalProduct}
        onOpenChange={(open) => !open && setFlavorModalProduct(null)}
        title={flavorModalProduct?.name ?? ""}
        flavors={flavorModalProduct?.flavors ?? []}
        flavorOptions={flavorModalProduct?.flavorOptions}
        fixedTarget={false}
        onSelectionChange={(selection) => setModalFlavor(selection?.[0]?.flavor ?? null)}
        onConfirm={confirmFlavorModal}
        onConfirmed={() => setFlavorModalProduct(null)}
        confirmDisabled={!modalFlavor}
        confirmLabel="Add to Box"
      />

      {/* Under the box's own 4-cookie suggestion — still addable, just a
          heads-up about the real (site-wide) $20 checkout minimum. */}
      <Dialog open={showMinWarning} onOpenChange={setShowMinWarning}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-brand-brown">Just a heads up</DialogTitle>
            <DialogDescription>
              Your cart needs at least $20 total to check out. You can still add this now and keep shopping.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowMinWarning(false)}>
              Keep building
            </Button>
            <AddToCartButton
              onAdd={performAddToCart}
              onAnimationComplete={() => setShowMinWarning(false)}
              className="flex-1"
            >
              Add anyway
            </AddToCartButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
