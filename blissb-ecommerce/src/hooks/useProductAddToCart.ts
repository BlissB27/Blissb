import { useState } from "react";
import type { MouseEvent } from "react";
import { useCartStore } from "@/store/cartStore";
import type { BoxFlavor } from "@/store/cartStore";
import type { Product } from "@/data/products";

/**
 * Shared add-to-cart orchestration for products that may need a flavor split
 * (a plain "Add to Cart" click, or one that opens a dialog with a FlavorSelector
 * first). Used by ProductCard, and by any hero/feature block that spotlights a
 * single product with the same interaction (e.g. the Mini Cookie Box hero).
 *
 * Accepts `product: null` for heroes that render their trigger button before the
 * product has finished loading (e.g. still fetching from Strapi) — every handler
 * becomes a no-op until a product is passed in, so the button can be rendered
 * immediately (disabled) without waiting on the network.
 */
export function useProductAddToCart(product: Product | null) {
  const { addItem } = useCartStore();
  const [boxFlavors, setBoxFlavors] = useState<BoxFlavor[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const hasFlavorSelector = !!product?.flavors && product.flavors.length > 0;
  const isUnconfiguredBox = !!product?.isSoldInBox && !product.boxSize;
  const needsOptions = hasFlavorSelector && !isUnconfiguredBox;

  const finishAdd = (options: { boxFlavors?: BoxFlavor[] }): boolean => {
    if (!product) return false;
    setErrorMessage(null);
    const result = addItem(product, { quantity: 1, ...options });
    if (!result.success) {
      setErrorMessage(result.error ?? "Couldn't add this to your cart.");
      return false;
    }
    setBoxFlavors(null);
    return true;
  };

  const handleAddToCart = (e?: MouseEvent<HTMLButtonElement>): boolean => {
    e?.preventDefault();
    if (!product || isUnconfiguredBox) return false;

    if (needsOptions) {
      setIsOptionsOpen(true);
      return false;
    }

    return finishAdd({});
  };

  const handleConfirmOptions = (): boolean => {
    if (hasFlavorSelector && !boxFlavors) return false; // FlavorSelector shows the invalid state
    return finishAdd({
      boxFlavors: hasFlavorSelector ? boxFlavors ?? undefined : undefined,
    });
  };

  return {
    hasFlavorSelector,
    isUnconfiguredBox,
    needsOptions,
    isOptionsOpen,
    setIsOptionsOpen,
    boxFlavors,
    setBoxFlavors,
    errorMessage,
    handleAddToCart,
    handleConfirmOptions,
  };
}
