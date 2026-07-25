"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/data/products";
import type { BoxFlavor } from "@/store/cartStore";

const MAX_FLAVORS = 3;

type BoxFlavorSelectorProps = {
  product: Product;
  onSelectionChange: (boxFlavors: BoxFlavor[] | null) => void;
};

export function BoxFlavorSelector({ product, onSelectionChange }: BoxFlavorSelectorProps) {
  const flavors = product.flavors ?? [];
  const boxSize = product.boxSize;

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selectedFlavors = Object.keys(quantities);
  const total = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const isValid = !!boxSize && selectedFlavors.length > 0 && selectedFlavors.length <= MAX_FLAVORS && total === boxSize;

  useEffect(() => {
    if (!isValid || !boxSize) {
      onSelectionChange(null);
      return;
    }

    onSelectionChange(
      selectedFlavors.map((flavor) => ({ flavor, quantity: quantities[flavor] }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantities, isValid, boxSize]);

  if (!boxSize) {
    return (
      <div className="mb-6 rounded-lg border border-[#E6D7CB] bg-[#F8F4F0] p-4">
        <p className="text-sm text-[#6E5B4E]">
          This box isn&apos;t available online yet — please contact us directly to order it.
        </p>
      </div>
    );
  }

  const toggleFlavor = (flavor: string, checked: boolean) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (checked) {
        if (Object.keys(next).length >= MAX_FLAVORS) return prev;
        next[flavor] = 0;
      } else {
        delete next[flavor];
      }
      return next;
    });
  };

  const setQuantity = (flavor: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [flavor]: Math.max(0, quantity) }));
  };

  return (
    <div className="mb-6">
      <p className="text-sm text-[#6E5B4E] mb-2">
        Choose up to {MAX_FLAVORS} flavors and split the {boxSize} cookies between them:
      </p>

      <div className="space-y-2">
        {flavors.map((flavor) => {
          const isChecked = flavor in quantities;
          const isDisabled = !isChecked && selectedFlavors.length >= MAX_FLAVORS;

          return (
            <div
              key={flavor}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                isChecked ? "border-[#8F4B2B] bg-[#8F4B2B]/5" : "border-[#E6D7CB]"
              } ${isDisabled ? "opacity-50" : ""}`}
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <Checkbox
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => toggleFlavor(flavor, checked === true)}
                />
                <span className="text-sm text-[#3B2A22]">{flavor}</span>
              </label>

              {isChecked && (
                <div className="flex items-center border border-[#E6D7CB] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(flavor, quantities[flavor] - 1)}
                    className="px-3 py-1 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm">
                    {quantities[flavor]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(flavor, quantities[flavor] + 1)}
                    className="px-3 py-1 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className={`text-sm mt-2 ${total === boxSize ? "text-[#1E7A31]" : "text-[#6E5B4E]"}`}>
        {total} / {boxSize} selected
        {selectedFlavors.length > 0 && total !== boxSize && " — quantities must add up exactly to the box size"}
      </p>
    </div>
  );
}
