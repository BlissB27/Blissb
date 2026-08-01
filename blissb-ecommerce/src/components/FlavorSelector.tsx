"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { BoxFlavor } from "@/store/cartStore";

const MAX_FLAVORS = 5;

type FlavorSelectorProps = {
  flavors: string[];
  /** Box products (fixed size, e.g. a 50-count box): the split must sum exactly to this. */
  targetQuantity?: number;
  /** true for box products with a fixed size; false lets the customer build the total from the flavors themselves. */
  fixedTarget: boolean;
  onSelectionChange: (selection: BoxFlavor[] | null) => void;
};

export function FlavorSelector({ flavors, targetQuantity, fixedTarget, onSelectionChange }: FlavorSelectorProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selectedFlavors = Object.keys(quantities);
  const total = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const isValid = fixedTarget
    ? !!targetQuantity && targetQuantity > 0 && selectedFlavors.length > 0 && selectedFlavors.length <= MAX_FLAVORS && total === targetQuantity
    : selectedFlavors.length > 0 && selectedFlavors.length <= MAX_FLAVORS && total >= 1;

  useEffect(() => {
    if (!isValid) {
      onSelectionChange(null);
      return;
    }

    onSelectionChange(
      selectedFlavors.map((flavor) => ({ flavor, quantity: quantities[flavor] }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantities, isValid, targetQuantity]);

  const toggleFlavor = (flavor: string, checked: boolean) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (checked) {
        if (Object.keys(next).length >= MAX_FLAVORS) return prev;
        // Free-form mode: a newly checked flavor starts at 1, so it's never a "phantom" empty slot.
        next[flavor] = fixedTarget ? 0 : 1;
      } else {
        delete next[flavor];
      }
      return next;
    });
  };

  const floor = fixedTarget ? 0 : 1;
  const setQuantity = (flavor: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [flavor]: Math.max(floor, quantity) }));
  };

  const statusText = fixedTarget
    ? `${total} / ${targetQuantity} selected${selectedFlavors.length > 0 && total !== targetQuantity ? " — quantities must add up exactly to the quantity selected" : ""}`
    : `${total} total selected`;
  const statusIsGood = fixedTarget ? total === targetQuantity : total >= 1;

  return (
    <div className="mb-6">
      <p className="text-sm text-brand-muted mb-2">
        {fixedTarget
          ? `Choose up to ${MAX_FLAVORS} flavors and split the ${targetQuantity} between them:`
          : `Choose up to ${MAX_FLAVORS} flavors and set the quantity for each:`}
      </p>

      <div className="space-y-2">
        {flavors.map((flavor) => {
          const isChecked = flavor in quantities;
          const isDisabled = !isChecked && selectedFlavors.length >= MAX_FLAVORS;

          return (
            <div
              key={flavor}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                isChecked ? "border-brand-brown bg-brand-brown/5" : "border-brand-border"
              } ${isDisabled ? "opacity-50" : ""}`}
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <Checkbox
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => toggleFlavor(flavor, checked === true)}
                />
                <span className="text-sm text-brand-text">{flavor}</span>
              </label>

              {isChecked && (
                <div className="flex items-center border border-brand-border rounded-lg">
                  <button
                    type="button"
                    aria-label={`Decrease ${flavor} quantity`}
                    onClick={() => setQuantity(flavor, quantities[flavor] - 1)}
                    disabled={quantities[flavor] <= floor}
                    className="px-3 py-1 hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm">
                    {quantities[flavor]}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase ${flavor} quantity`}
                    onClick={() => setQuantity(flavor, quantities[flavor] + 1)}
                    className="px-3 py-1 hover:bg-brand-bg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className={`text-sm mt-2 ${statusIsGood ? "text-brand-success" : "text-brand-muted"}`}>
        {statusText}
      </p>
    </div>
  );
}
