"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import type { BoxFlavor } from "@/store/cartStore";
import { toSentenceCase } from "@/lib/text";

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
              className="flex flex-col text-center"
            >
              {/* Only the photo gets the card treatment (border, rounded
                  corners, margin) — the name sits outside it, not sharing
                  the same border/box. */}
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-brand-bg p-1.5 transition-colors ${
                  isSelected ? "border-brand-brown" : "border-brand-border hover:border-brand-brown/40"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  {image && <Image src={image} alt="" fill className="object-cover" sizes="120px" />}
                </div>

                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-brown text-white">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                )}
              </div>

              <span className="mt-1.5 text-xs font-medium text-brand-muted">{toSentenceCase(flavor)}</span>
            </button>
          );
        })}
      </div>
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
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const isValid = !!targetQuantity && targetQuantity > 0 && selectedFlavors.length > 0 && selectedFlavors.length <= MAX_BOX_FLAVORS;

  useEffect(() => {
    if (!isValid || !targetQuantity) {
      onSelectionChange(null);
      return;
    }
    // Split evenly and invisibly — the customer just picks flavors, not
    // amounts; any remainder goes one-each to the first-picked flavors
    // (e.g. 50 across 3 -> 17, 17, 16).
    const n = selectedFlavors.length;
    const base = Math.floor(targetQuantity / n);
    const remainder = targetQuantity % n;
    onSelectionChange(selectedFlavors.map((flavor, i) => ({ flavor, quantity: base + (i < remainder ? 1 : 0) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlavors, isValid, targetQuantity]);

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavor)) return prev.filter((f) => f !== flavor);
      if (prev.length >= MAX_BOX_FLAVORS) return prev;
      return [...prev, flavor];
    });
  };

  return (
    <div className="mb-6">
      <p className="text-sm text-brand-muted mb-2">Choose up to {MAX_BOX_FLAVORS} flavors:</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {flavors.map((flavor) => {
          const isChecked = selectedFlavors.includes(flavor);
          const isDisabled = !isChecked && selectedFlavors.length >= MAX_BOX_FLAVORS;
          const image = imageByFlavor[flavor];

          return (
            <button
              type="button"
              key={flavor}
              aria-pressed={isChecked}
              disabled={isDisabled}
              onClick={() => toggleFlavor(flavor)}
              className={`flex flex-col text-center ${isDisabled ? "opacity-50" : ""}`}
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-brand-bg p-1.5 transition-colors ${
                  isChecked ? "border-brand-brown" : "border-brand-border hover:border-brand-brown/40"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  {image && <Image src={image} alt="" fill className="object-cover" sizes="120px" />}
                </div>

                {isChecked && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-brown text-white">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                )}
              </div>

              <span className="mt-1.5 text-xs font-medium text-brand-muted">{toSentenceCase(flavor)}</span>
            </button>
          );
        })}
      </div>
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
