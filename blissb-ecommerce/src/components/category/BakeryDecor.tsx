"use client";

import { motion } from "framer-motion";
import { Cake, ChefHat, CookingPot, Cookie, Sparkle, type LucideIcon } from "lucide-react";

// Whisk icon — Lucide core doesn't ship one, so this uses the matching icon from
// Lucide Lab (github.com/lucide-icons/lucide-lab, ISC license), same stroke style
// as the rest of this set.
export function Whisk({
  className,
  style,
  strokeWidth = 1.5,
}: {
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M22 2L3.45 20.55m.05-7.05a5 5 0 1 0 7.1 7.1C12.6 18.6 15 9 15 9s-9.6 2.5-11.5 4.5" />
    </svg>
  );
}

// Scattered bakery-themed icons — each non-star icon appears once; only the
// sparkle repeats, the same way a couple of stars would in a Krokem-style hero.
const DECOR: { Icon: LucideIcon | typeof Whisk; top: string; left?: string; right?: string; size: string; delay: number; opacity: string }[] = [
  { Icon: Whisk, top: "10%", left: "6%", size: "w-9 h-9", delay: 0, opacity: "text-white/55" },
  { Icon: Cookie, top: "70%", left: "9%", size: "w-8 h-8", delay: 0.4, opacity: "text-white/40" },
  { Icon: ChefHat, top: "18%", right: "7%", size: "w-9 h-9", delay: 0.2, opacity: "text-white/50" },
  { Icon: Cake, top: "70%", right: "6%", size: "w-10 h-10", delay: 0.6, opacity: "text-white/55" },
  { Icon: CookingPot, top: "44%", right: "16%", size: "w-7 h-7", delay: 0.8, opacity: "text-white/35" },
  { Icon: Sparkle, top: "6%", left: "40%", size: "w-4 h-4", delay: 0.3, opacity: "text-white/35" },
  { Icon: Sparkle, top: "50%", left: "22%", size: "w-3 h-3", delay: 0.7, opacity: "text-white/30" },
  { Icon: Sparkle, top: "88%", left: "42%", size: "w-3 h-3", delay: 0.5, opacity: "text-white/30" },
  { Icon: Sparkle, top: "30%", left: "16%", size: "w-2.5 h-2.5", delay: 0.9, opacity: "text-white/25" },
  { Icon: Sparkle, top: "34%", right: "26%", size: "w-4 h-4", delay: 0.5, opacity: "text-white/30" },
  { Icon: Sparkle, top: "88%", right: "28%", size: "w-3 h-3", delay: 1, opacity: "text-white/25" },
];

/** Scattered bakery icons + sparkles floating over a brand-brown hero — used by
 * both the Cookies and Cakes heroes so the two share one consistent background. */
export function BakeryDecor() {
  return (
    <>
      {DECOR.map(({ Icon, top, left, right, size, delay, opacity }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay }}
          className={`pointer-events-none absolute ${opacity}`}
          style={{ top, left, right }}
        >
          <Icon className={size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </>
  );
}
