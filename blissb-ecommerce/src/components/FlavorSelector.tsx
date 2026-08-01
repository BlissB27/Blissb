"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import type { BoxFlavor } from "@/store/cartStore";

// Only the box products (e.g. Mini Cookie Box) split a fixed count across
// multiple flavors. Regular products get exactly one flavor — see the
// !fixedTarget branch below, which is a plain single-choice picker.
const MAX_BOX_FLAVORS = 3;

type FlavorSelectorProps = {
  flavors: string[];
  /** Photo per flavor, keyed by the same name used in `flavors` — optional
   * while flavors are still being migrated in Strapi, so a flavor with no
   * matching entry here just renders without a thumbnail. */
  flavorOptions?: { name: string; image: string }[];
  /** Box products (fixed size, e.g. a 50-count box): the split must sum exactly to this. */
  targetQuantity?: number;
  /** true for box products with a fixed size and a multi-flavor split; false for a single-flavor pick. */
  fixedTarget: boolean;
  /** Always emits `BoxFlavor[]` for API-compatibility with box mode, but in
   * single-flavor mode the array only ever holds one entry (quantity is a
   * fixed placeholder — the actual purchase quantity lives outside this
   * component, e.g. a normal quantity stepper next to it). */
  onSelectionChange: (selection: BoxFlavor[] | null) => void;
};

function ImageThumb({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <div className="relative w-10 h-10 flex-shrink-0 rounded-md overflow-hidden bg-brand-bg">
      <Image src={src} alt="" fill className="object-cover" sizes="40px" />
    </div>
  );
}

function SingleFlavorPicker({
  flavors,
  imageByFlavor,
  onSelectionChange,
}: {
  flavors: string[];
  imageByFlavor: Record<string, string>;
  onSelectionChange: (selection: BoxFlavor[] | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    onSelectionChange(selected ? [{ flavor: selected, quantity: 1 }] : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="mb-6">
      <p className="text-sm text-brand-muted mb-2">Choose a flavor:</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="Flavor">
        {flavors.map((flavor) => {
          const isSelected = selected === flavor;
          const image = imageByFlavor[flavor];
          return (
            <button
              type="button"
              key={flavor}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(flavor)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 text-center transition-colors ${
                isSelected ? "border-brand-brown bg-brand-brown/5" : "border-brand-border hover:border-brand-brown/40"
              }`}
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-brand-bg">
                {image ? (
                  <Image src={image} alt="" fill className="object-cover" sizes="120px" />
                ) : (
                  <div className="absolute inset-0" />
                )}
              </div>
              <span className="text-xs font-medium text-brand-text line-clamp-2">{flavor}</span>
            </button>
          );
        })}
      </div>

      {!selected && (
        <p aria-live="polite" className="text-sm mt-2 text-brand-muted">
          Select one flavor
        </p>
      )}
    </div>
  );
}

function BoxFlavorPicker({
  flavors,
  imageByFlavor,
  targetQuantity,
  onSelectionChange,
}: {
  flavors: string[];
  imageByFlavor: Record<string, string>;
  targetQuantity?: number;
  onSelectionChange: (selection: BoxFlavor[] | null) => void;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selectedFlavors = Object.keys(quantities);
  const total = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const isValid =
    !!targetQuantity && targetQuantity > 0 && selectedFlavors.length > 0 && selectedFlavors.length <= MAX_BOX_FLAVORS && total === targetQuantity;

  useEffect(() => {
    if (!isValid) {
      onSelectionChange(null);
      return;
    }
    onSelectionChange(selectedFlavors.map((flavor) => ({ flavor, quantity: quantities[flavor] })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantities, isValid, targetQuantity]);

  const toggleFlavor = (flavor: string, checked: boolean) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (checked) {
        if (Object.keys(next).length >= MAX_BOX_FLAVORS) return prev;
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

  const statusText = `${total} / ${targetQuantity} selected${
    selectedFlavors.length > 0 && total !== targetQuantity ? " — quantities must add up exactly to the quantity selected" : ""
  }`;
  const statusIsGood = total === targetQuantity;

  return (
    <div className="mb-6">
      <p className="text-sm text-brand-muted mb-2">
        Choose up to {MAX_BOX_FLAVORS} flavors and split the {targetQuantity} between them:
      </p>

      <div className="space-y-2">
        {flavors.map((flavor) => {
          const isChecked = flavor in quantities;
          const isDisabled = !isChecked && selectedFlavors.length >= MAX_BOX_FLAVORS;

          return (
            <div
              key={flavor}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                isChecked ? "border-brand-brown bg-brand-brown/5" : "border-brand-border"
              } ${isDisabled ? "opacity-50" : ""}`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <Checkbox
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => toggleFlavor(flavor, checked === true)}
                />
                <ImageThumb src={imageByFlavor[flavor]} />
                <span className="text-sm text-brand-text">{flavor}</span>
              </label>

              {isChecked && (
                <div className="flex items-center border border-brand-border rounded-lg">
                  <button
                    type="button"
                    aria-label={`Decrease ${flavor} quantity`}
                    onClick={() => setQuantity(flavor, quantities[flavor] - 1)}
                    disabled={quantities[flavor] <= 0}
                    className="px-3 py-1 hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm">{quantities[flavor]}</span>
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

export function FlavorSelector({ flavors, flavorOptions, targetQuantity, fixedTarget, onSelectionChange }: FlavorSelectorProps) {
  const imageByFlavor = useMemo(
    () => Object.fromEntries((flavorOptions ?? []).map((f) => [f.name, f.image])),
    [flavorOptions]
  );

  return fixedTarget ? (
    <BoxFlavorPicker flavors={flavors} imageByFlavor={imageByFlavor} targetQuantity={targetQuantity} onSelectionChange={onSelectionChange} />
  ) : (
    <SingleFlavorPicker flavors={flavors} imageByFlavor={imageByFlavor} onSelectionChange={onSelectionChange} />
  );
}
