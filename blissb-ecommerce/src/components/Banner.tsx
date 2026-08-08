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
  ctaLabel: string;
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
  ctaLabel,
  panelBg,
  panelText = "#FFFFFF",
  textFraction = "1fr",
  imageFraction = "1fr",
  objectPosition = "center",
}: Occasion) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md bg-transparent isolate w-full"
      style={
        {
          // @ts-ignore - custom CSS vars para grid desktop
          "--text": textFraction,
          "--image": imageFraction,
          "--panel-bg": panelBg,
          "--panel-text": panelText,
        } as React.CSSProperties
      }
    >
      {/* Mobile: stack | Desktop: grid 2 filas (imagen arriba, texto abajo) para que ninguna se vea recortada */}
      <div className="flex flex-col md:h-full">
        {/* Panel de imagen */}
        <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[220px]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>

        {/* Panel de texto */}
        <div
          className="w-full flex-1 px-5 pt-2 pb-3 md:px-6 md:pt-3 md:pb-4 flex flex-col"
          style={{ backgroundColor: "var(--panel-bg)", color: "var(--panel-text)" }}
        >
          <h3 className="text-lg md:text-xl font-semibold leading-tight font-display mb-1">
            {title}
          </h3>
          <p className="text-sm opacity-90 leading-relaxed mb-2">
            {description}
          </p>
          <div>
            <Button asChild className="rounded-md bg-white px-4 py-1.5 text-xs text-brand-brown hover:bg-white/90 md:px-5 md:py-2 md:text-sm">
              <a href={href}>{ctaLabel}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sección completa */
export default function Banner() {
  return (
    <section className="bg-[#ffeccf] relative">
      {/* Wave divider at the top */}
      <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 md:py-8 my-8 md:my-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-brand-brown">
            Cookies for Every Occasion
          </h2>
          <p className="mt-2 text-brand-muted max-w-xl mx-auto text-sm md:text-base">
            From office thank-yous to wedding dessert tables, here&apos;s how Bliss-B shows up for your event.
          </p>
        </motion.div>

        {/* Grid de cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.2, duration: 0.6 }}
          className="mt-8 grid grid-cols-1 gap-5 md:gap-6 md:grid-cols-3"
        >
          <BannerCard
            title="Events"
            description="Bliss-B travels to you. Our cookie and cake carts bring a full dessert experience to your event, served fresh from start to finish."
            imageSrc="/img/carrito.jpeg"
            href="/corporate?section=cookie-cart"
            ctaLabel="Book Our Cart"
            panelBg="#9B562C"
            objectPosition="center"
          />
          <BannerCard
            title="Corporate Gifts"
            description="Share Bliss-B with clients and teams. Each cookie carries your logo, packaged fresh in a clean, ready-to-share box."
            imageSrc="/img/corporate.jpeg"
            href="/corporate?section=corporate-gifting"
            ctaLabel="Get a Quote"
            panelBg="#7A4522"
            objectPosition="center"
          />
          <BannerCard
            title="Catering"
            description="Cookies, brownies, and more, in the quantities your event calls for. Perfect for weddings, parties, and gatherings."
            imageSrc="/img/caterine.jpeg"
            href="/corporate?section=catering"
            ctaLabel="See Catering Options"
            panelBg="#9B562C"
            objectPosition="center"
          />
        </motion.div>
      </div>

      {/* Wave divider at the bottom */}
      <WaveDivider direction="bottom" color="#ffffff" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
