"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

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
              className="rounded-full border px-5 py-2 text-sm"
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
    <section className="bg-[#F5EBDD]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-14">
        {/* Título */}
        <h2 className="text-center text-2xl md:text-4xl font-bold text-[#8F4B2B]">
          Cookies for Every Occasion
        </h2>

        {/* Grid de cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:gap-6 md:grid-cols-3">
          <BannerCard
            title="Events"
            description="Lorem Ipsum is simply dummy text of the printing."
            imageSrc="/img/1.png"
            panelBg="#9A4F2A"
            objectPosition="center"
          />
          <BannerCard
            title="Corporate Gifts"
            description="Lorem Ipsum is simply dummy text of the printing."
            imageSrc="/img/2.png"
            panelBg="#EFC596"
            objectPosition="center"
          />
          <BannerCard
            title="Catering"
            description="Lorem Ipsum is simply dummy text of the printing."
            imageSrc="/img/3.png"
            panelBg="#9A4F2A"
            objectPosition="center"
          />
        </div>
      </div>
    </section>
  );
}