"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarClock, Mail, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroShell, HeroEyebrow } from "@/components/category/HeroShell";
import type { HeroConfig } from "@/services/heroes";

const EMAIL_HREF = "mailto:blissbdesserts@gmail.com";

const FEATURES = [
  {
    Icon: CalendarClock,
    title: "Book 2 Weeks Ahead",
    description: "Give us at least two weeks' notice so every order gets the care and prep time it deserves.",
  },
  {
    Icon: Sparkles,
    title: "Custom Quotes",
    description: "Every quote is tailored to your guest count, menu, and budget — never a generic package.",
  },
  {
    Icon: MapPin,
    title: "Serving Braselton & Beyond",
    description: "Based in Braselton, GA, with cart service and delivery available for nearby events.",
  },
];

type CorporateHeroProps = {
  /** Textos y foto principal editables desde Strapi (Hero key="corporate"). */
  hero?: HeroConfig | null;
};

export function CorporateHero({ hero }: CorporateHeroProps) {
  const eyebrow = hero?.eyebrow || "Weddings · Corporate Events · Private Celebrations";
  const heading = hero?.title || "Desserts That Make Your Event Unforgettable";
  const subtitle =
    hero?.subtitle ||
    "From wedding dessert tables to corporate gifting and our signature cookie cart, Bliss-B brings handcrafted treats to every kind of celebration — custom to your guest count, menu, and budget.";
  const primaryImage = hero?.image || "/img/event1.jpeg";
  return (
    <HeroShell>
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-20 md:pb-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="text-center md:text-left"
        >
          <HeroEyebrow icon={Sparkles} align="start">
            {eyebrow}
          </HeroEyebrow>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {heading}
          </h1>

          <p className="text-white/85 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
            {subtitle}
          </p>

          <Button className="bg-white text-brand-brown hover:bg-white/90" size="lg" asChild>
            <a href={EMAIL_HREF} className="flex items-center gap-2">
              <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Email us
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
              src={primaryImage}
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

      {/* Booking basics stay inside the same terracotta panel as the rest of the
          hero (per the v2 layout) instead of a separate colored band — the
          WaveDivider in HeroShell closes this whole block in one wave. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.3, duration: 0.6 }}
        className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {FEATURES.map((feature) => (
          <div key={feature.title} className="text-center">
            <div className="w-14 h-14 rounded-full border border-white/50 bg-white/10 flex items-center justify-center mx-auto mb-3">
              <feature.Icon className="w-6 h-6 text-white" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-white mb-1.5 text-sm md:text-base">{feature.title}</h3>
            <p className="text-sm text-white/80">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </HeroShell>
  );
}
