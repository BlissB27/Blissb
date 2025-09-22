"use client";

import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-[#F8EDE4]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-20 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        {/* Text left */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-[#3B2A22] leading-tight mb-4">
            Bliss-B is more <br className="hidden md:block" /> than a bakery
          </h1>
          <p className="text-[#6E5B4E] text-base md:text-lg mb-6">
            At <span className="text-[#8F4B2B] font-medium">Bliss-B Bakery</span>, we believe that desserts
            should not only taste amazing but also tell a story.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-[#8F4B2B] text-white px-6 py-2 rounded-md text-sm md:text-base font-medium hover:bg-[#6f3a22] transition"
          >
            See The Menu
          </Link>
        </div>

        {/* Image right */}
        <div className="w-full md:w-1/2 relative flex justify-center">
          <Image
            src="/img/hero.png" // Asegúrate de tener esta imagen aquí
            alt="Flying cookies"
            width={500}
            height={500}
            className="w-[1080px] sm:w-[360px] md:w-[1450px] h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}