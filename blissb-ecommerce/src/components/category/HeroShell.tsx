"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { WaveDivider } from "@/components/WaveDivider";
import { BakeryDecor } from "@/components/category/BakeryDecor";

/**
 * The section/decoration/wave shell every category hero sits in. Only wraps
 * that outer boilerplate — each hero still owns its own inner content
 * (grid vs. flex, plain div vs. motion.div for stagger animations).
 */
export function HeroShell({ children, withWave = true }: { children: ReactNode; withWave?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-brand-brown">
      <BakeryDecor />
      {children}
      {withWave && <WaveDivider direction="bottom" color="#FFFFFF" className="absolute bottom-0 left-0 right-0" />}
    </section>
  );
}

/** The small icon + label badge above every hero's headline. */
export function HeroEyebrow({
  icon: Icon,
  align = "center",
  children,
}: {
  icon: LucideIcon;
  /** "start" left-aligns on md+ to match a hero whose text is centered on mobile, left-aligned on desktop. */
  align?: "center" | "start";
  children: ReactNode;
}) {
  return (
    <div className={`mb-4 flex items-center gap-2 ${align === "start" ? "justify-center md:justify-start" : "justify-center"}`}>
      <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
      <span className="text-sm font-medium text-white">{children}</span>
    </div>
  );
}
