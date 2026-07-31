"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BakeryDecor } from "@/components/category/BakeryDecor";

const CALL_HREF = "tel:+14708835035";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-brand-brown">
      <BakeryDecor />

      <div className="relative mx-auto max-w-[900px] px-4 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Phone className="h-5 w-5 text-white" strokeWidth={1.75} />
            <span className="text-sm font-medium text-white">We&apos;d Love to Hear From You</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Let&apos;s Talk
          </h1>
          <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            The fastest way to get an answer is to call — no forms, no waiting on email.
            We pick up during business hours, and we&apos;ll text you back if we miss you.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 260, delay: 0.15 }}
            className="mt-8"
          >
            <Button asChild size="lg" className="bg-white text-brand-brown hover:bg-white/90 text-lg px-8 py-6">
              <a href={CALL_HREF}>
                <Phone className="h-5 w-5" strokeWidth={2} />
                Get Help With Your Order
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
