"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroFlankingPhotoProps = {
  src?: string;
  alt?: string;
  tilt: "left" | "right";
};

/** A real photo flanking a hero's centered text, tilted, that straightens and
 * lifts on hover. Shared by the Cakes, Desserts, and Corporate heroes. */
export function HeroFlankingPhoto({ src, alt, tilt }: HeroFlankingPhotoProps) {
  if (!src) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: tilt === "left" ? -6 : 6 }}
      whileHover={{
        scale: 1.08,
        rotate: tilt === "left" ? -2 : 2,
        y: -8,
        transition: { type: "spring", damping: 15, stiffness: 300 },
      }}
      transition={{ type: "spring", damping: 22, stiffness: 260, delay: 0.2 }}
      className="hidden md:block cursor-pointer"
    >
      <div className="relative aspect-square w-40 lg:w-52 overflow-hidden rounded-2xl shadow-2xl">
        <Image src={src} alt={alt ?? ""} fill className="object-cover" sizes="208px" />
      </div>
    </motion.div>
  );
}

/** Smooth-scrolls to an in-page section, offset by the sticky header's real
 * height so the section doesn't end up hidden underneath it. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const headerOffset = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
  window.scrollTo({ top, behavior: "smooth" });
}
