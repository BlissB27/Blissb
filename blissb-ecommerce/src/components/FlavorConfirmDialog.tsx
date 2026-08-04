"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlavorSelector } from "@/components/FlavorSelector";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { BoxFlavor } from "@/store/cartStore";

type FlavorConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  flavors: string[];
  flavorOptions?: { name: string; image: string }[];
  fixedTarget: boolean;
  targetQuantity?: number;
  onSelectionChange: (selection: BoxFlavor[] | null) => void;
  errorMessage?: string | null;
  onConfirm: () => boolean;
  onConfirmed: () => void;
  confirmDisabled: boolean;
  confirmLabel?: string;
};

/**
 * The "pick a flavor, then add to cart" dialog shared by every place a single
 * product can be added with a flavor split: product grids, hero CTAs, and the
 * cookie box builder's per-cookie flavor modal.
 */
export function FlavorConfirmDialog({
  open,
  onOpenChange,
  title,
  flavors,
  flavorOptions,
  fixedTarget,
  targetQuantity,
  onSelectionChange,
  errorMessage,
  onConfirm,
  onConfirmed,
  confirmDisabled,
  confirmLabel = "Add to Cart",
}: FlavorConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brand-brown">{title}</DialogTitle>
        </DialogHeader>

        <FlavorSelector
          flavors={flavors}
          flavorOptions={flavorOptions}
          fixedTarget={fixedTarget}
          targetQuantity={targetQuantity}
          onSelectionChange={onSelectionChange}
        />

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <AddToCartButton
          onAdd={onConfirm}
          onAnimationComplete={onConfirmed}
          disabled={confirmDisabled}
          className="w-full"
        >
          {confirmLabel}
        </AddToCartButton>
      </DialogContent>
    </Dialog>
  );
}
