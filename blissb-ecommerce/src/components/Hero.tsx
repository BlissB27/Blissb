"use client";

import Image from "next/image";
import Link from "next/link";
import { WaveDivider } from "./WaveDivider";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="bg-white relative">
      <div className="mx-auto max-w-[1600px] flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Text left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.6
          }}
          className="w-full md:p-30 text-center md:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.2,
              duration: 0.6
            }}
            className="text-4xl md:text-7xl font-bold text-[#3B2A22] leading-tight mb-4"
          >
            Bliss-B is more <br className="hidden md:block" /> than a bakery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.4,
              duration: 0.6
            }}
            className="text-[#6E5B4E] text-base md:text-lg mb-6"
          >
            At <span className="text-[#8F4B2B] font-medium">Bliss-B Bakery</span>, we believe that desserts
            should not only taste amazing but also tell a story.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.6,
              duration: 0.6
            }}
          >
            <Link
              href="/cookies"
              className="inline-block bg-[#8F4B2B] text-white px-6 py-2 rounded-md mb-4 text-sm md:text-base font-medium hover:bg-[#6f3a22] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              See The Menu
            </Link>
          </motion.div>
        </motion.div>

        {/* Image right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.3,
            duration: 0.6
          }}
          className="w-full md:w-full relative flex justify-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: 0.5,
              duration: 0.8
            }}
          >
            <Image
              src="/img/hero.png" // Asegúrate de tener esta imagen aquí
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