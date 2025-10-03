"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "./WaveDivider";
import { motion } from "framer-motion";

/** Tipos */
type Occasion = {
  title: string;
  description: string;
  imageSrc: string;
  href?: string;
  /** Color del panel de texto (lado sólido) */
  panelBg: string;
  panelText?: string;
  /** Proporción desktop izquierda/derecha (grid) */
  textFraction?: string;   // ej. "2fr"
  imageFraction?: string;  // ej. "3fr"
  /** Foco de la imagen por si el asset tiene margen interno */
  objectPosition?: string; // ej. "center" | "center top" | "left center"
};

/** Card individual */
function BannerCard({
  title,
  description,
  imageSrc,
  href = "#",
  panelBg,
  panelText = "#FFFFFF",
  textFraction = "2fr",
  imageFraction = "3fr",
  objectPosition = "center",
}: Occasion) {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        shadow-[0_8px_20px_rgba(0,0,0,0.08)]
        bg-transparent isolate
        md:h-[355px]                         /* desktop: altura fija */
      "
      style={
        {
          // @ts-ignore - custom CSS vars para grid desktop
          "--text": textFraction,
          "--image": imageFraction,
        } as React.CSSProperties
      }
    >
      {/* Mobile: stack  |  Desktop: grid 2 columnas que llenan 100% */}
      <div className="flex flex-col md:grid md:grid-cols-[var(--text)_var(--image)] md:h-full">
        {/* Panel de texto */}
        <div
          className="w-full p-6 md:p-8 flex flex-col justify-center gap-4"
          style={{ backgroundColor: panelBg, color: panelText }}
        >
          <h3 className="text-xl md:text-2xl font-semibold leading-tight">
            {title}
          </h3>
          <p className="text-sm md:text-base opacity-90 leading-relaxed">
            {description}
          </p>
          <div>
            <Button
              asChild
              variant="ghost"
              className="rounded-md border px-5 py-2 text-sm hover:bg-[#3B2A22]"
              style={{ borderColor: panelText, color: panelText }}
            >
              <a href={href}>See The Menu</a>
            </Button>
          </div>
        </div>

        {/* Panel de imagen */}
        {/* Mobile: usa aspect ratio para evitar aplastado; Desktop: llena altura */}
        <div className="relative w-full overflow-hidden md:h-full">
          <div className="relative w-full aspect-[16/10] md:aspect-auto md:h-full">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
              style={{ objectPosition }}
              sizes="(max-width: 768px) 100vw, 40vw"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sección completa */
export default function Banner() {
  return (
    <section className="bg-[#F5EBDD] relative">
      {/* Wave divider at the top */}
      <WaveDivider direction="top" color="#ffff" className="absolute  left-0 right-0" />

      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-14 mt-12 md:mt-16">
        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.6
          }}
          className="text-center text-2xl md:text-4xl font-bold text-[#8F4B2B]"
        >
          Cookies for Every Occasion
        </motion.h2>

        {/* Grid de cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.2,
            duration: 0.6
          }}
          className="mt-8 grid grid-cols-1 gap-5 md:gap-6 md:grid-cols-3"
        >
          <BannerCard
            title="Events"
            description="Lorem Ipsum is simply dummy text of the printing."
            imageSrc="/img/1.png"
            href="/cookies"
            panelBg="#9A4F2A"
            objectPosition="center"
          />
          <BannerCard
            title="Corporate Gifts"
            description="Lorem Ipsum is simply dummy text of the printing."
            imageSrc="/img/2.png"
            href="/corporate"
            panelBg="#EFC596"
            objectPosition="center"
          />
          <BannerCard
            title="Catering"
            description="Lorem Ipsum is simply dummy text of the printing."
            imageSrc="/img/3.png"
            href="/corporate"
            panelBg="#9A4F2A"
            objectPosition="center"
          />
        </motion.div>
      </div>

      {/* Wave divider at the bottom */}
      <WaveDivider direction="bottom" color="#ffffff" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}