"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="bg-white relative">
      <div className="mx-auto max-w-[1600px] flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Text left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="w-full md:p-30 text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1, duration: 0.6 }}
            className="mb-4 flex items-center justify-center md:justify-start gap-2"
          >
            <Image
              src="/img/blisbpremio.png"
              width={40}
              height={27}
              alt=""
              aria-hidden="true"
              className="h-7 w-auto"
              style={{ width: 'auto' }}
            />
            <span className="text-sm font-medium text-brand-brown">
              Best of Georgia 2025 &middot; Top 5 dessert competition 2024
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-7xl font-bold text-brand-text leading-tight mb-4"
          >
            Bliss-B is more <br className="hidden md:block" /> than a bakery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.4, duration: 0.6 }}
            className="text-brand-muted text-base md:text-lg mb-6"
          >
            At <span className="text-brand-brown font-medium">Bliss-B Desserts</span>, we believe that desserts
            should not only taste amazing but also tell a story.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.6, duration: 0.6 }}
          >
            <Button asChild size="lg">
              <a
                href="#cookie-box-builder"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cookie-box-builder")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Build Your Cookie Box
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Image right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.3, duration: 0.6 }}
          className="w-full md:w-full relative flex justify-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.5, duration: 0.8 }}
          >
            <Image
              src="/img/hero.png"
              alt="Flying cookies"
              width={500}
              height={500}
              className="w-[1080px] sm:w-[360px] md:w-[1450px] h-auto object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
