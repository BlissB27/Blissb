"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroShell, HeroEyebrow } from "@/components/category/HeroShell";

const CALL_HREF = "tel:+14708835035";

export function CorporateHero() {
  return (
    <HeroShell withWave={false}>
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="text-center md:text-left"
        >
          <HeroEyebrow icon={Sparkles} align="start">
            Weddings &middot; Corporate Events &middot; Private Celebrations
          </HeroEyebrow>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Desserts That Make Your Event Unforgettable
          </h1>

          <p className="text-white/85 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
            From wedding dessert tables to corporate gifting and our signature cookie
            cart, Bliss-B brings handcrafted treats to every kind of celebration —
            custom to your guest count, menu, and budget.
          </p>

          <Button className="bg-white text-brand-brown hover:bg-white/90" size="lg" asChild>
            <a href={CALL_HREF} className="flex items-center gap-2">
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Call us
            </a>
          </Button>
        </motion.div>

        {/* Two photos, stacked diagonally like a quick photo collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2, duration: 0.7 }}
          className="relative mx-auto w-full max-w-sm aspect-square"
        >
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: -6 }}
            whileHover={{ rotate: -2, scale: 1.05, transition: { type: "spring", damping: 15, stiffness: 300 } }}
            className="absolute left-0 top-0 w-[68%] aspect-square overflow-hidden rounded-2xl shadow-xl cursor-pointer"
          >
            <Image
              src="/img/event1.jpeg"
              alt="The Bliss-B cart set up on-site at an event"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 60vw, 260px"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 6 }}
            whileHover={{ rotate: 2, scale: 1.05, transition: { type: "spring", damping: 15, stiffness: 300 } }}
            className="absolute bottom-0 right-0 w-[58%] aspect-square overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
          >
            <Image
              src="/img/carrito.jpeg"
              alt="The Bliss-B dessert cart styled for an event"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 220px"
            />
          </motion.div>
        </motion.div>
      </div>
    </HeroShell>
  );
}
