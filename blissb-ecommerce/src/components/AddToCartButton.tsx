"use client";

import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ADD_TO_CART_ANIMATION_MS = 900;

type AddToCartButtonProps = {
  /** Perform the actual add-to-cart action. Return true to play the confirmation animation, false to skip it (validation failed, or this click only opened an options dialog). */
  onAdd: (e: MouseEvent<HTMLButtonElement>) => boolean;
  /** Fires once the confirmation animation finishes — use it to close a dialog, etc. */
  onAnimationComplete?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size" | "variant">;

export function AddToCartButton({
  onAdd,
  onAnimationComplete,
  children,
  className,
  disabled,
  size,
  variant,
}: AddToCartButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (animating) return;
    if (onAdd(e)) setAnimating(true);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      size={size}
      variant={variant}
      className={cn("relative overflow-hidden", className)}
    >
      <span className="relative flex w-full items-center justify-center gap-1">
        {/* Invisible sizer: keeps the button's natural width/height stable across animation states — the overlays below are absolutely positioned and have no intrinsic size of their own. */}
        <span className="invisible flex w-full items-center justify-center gap-1" aria-hidden="true">
          {children}
        </span>

        <AnimatePresence initial={false}>
          {!animating ? (
            <motion.span
              key="label"
              exit={{ x: 32, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeIn" }}
              className="absolute inset-0 flex items-center justify-center gap-1"
            >
              {children}
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ x: -28, y: 0, opacity: 0 }}
              animate={{ x: [-28, 0, 0, 0], y: [0, 0, 0, 26], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: ADD_TO_CART_ANIMATION_MS / 1000,
                times: [0, 0.3, 0.6, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={() => {
                setAnimating(false);
                onAnimationComplete?.();
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Button>
  );
}
