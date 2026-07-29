"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Gift, Handshake, CakeSlice, type LucideIcon } from "lucide-react";

type Cta = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const CTAS: Cta[] = [
  { label: "Try our cookie boxes", href: "/cookies", Icon: Gift },
  { label: "Corporate events", href: "/corporate", Icon: Handshake },
  { label: "Explore our desserts", href: "/desserts", Icon: CakeSlice },
];

const ROTATE_MS = 5000;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -24 : 24, opacity: 0 }),
};

export function Carrusel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % CTAS.length);
    }, ROTATE_MS);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  const handleManualNav = (delta: number) => {
    setDirection(delta);
    setIndex((prev) => ((prev + delta) % CTAS.length + CTAS.length) % CTAS.length);
    restartTimer();
  };

  const current = CTAS[index];

  return (
    <div className="w-full bg-brand-brown text-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-3 px-4 py-2 overflow-hidden">
        <button
          onClick={() => handleManualNav(-1)}
          aria-label="Previous"
          className="text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="relative flex h-5 min-w-[220px] items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute flex items-center gap-2 whitespace-nowrap"
            >
              <Link href={current.href} className="flex items-center gap-2 text-[14px] font-medium">
                <current.Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {current.label}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => handleManualNav(1)}
          aria-label="Next"
          className="text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
