"use client";

import { useEffect } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { Card, CardContent } from "@/components/ui/card";

type AwardPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

function AwardPhotoLink({ src, alt, width, height, objectPosition = "center" }: AwardPhoto) {
  return (
    <a
      href={src}
      data-pswp-width={width}
      data-pswp-height={height}
      className="group relative block cursor-pointer overflow-hidden rounded-lg border-2 border-brand-brown/20 h-[300px] md:h-[400px]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectPosition }}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 300px"
      />
    </a>
  );
}

export function Awards() {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#awards-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    return () => lightbox.destroy();
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div id="awards-gallery" className="space-y-12">
          {/* 2024 Awards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: 2024 Text */}
            <div>
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-brown mb-2">
                    Top 5 GA Dessert Wars
                  </h2>
                  <div className="text-6xl md:text-8xl font-bold text-brand-accent mb-3 leading-none">
                    2024
                  </div>
                  <p className="text-brand-muted text-sm md:text-base">
                    Recognized among the top five desserts in Georgia's biggest sweet competition.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: 2024 Images */}
            <div className="grid grid-cols-2 gap-4">
              <AwardPhotoLink src="/img/Premio/homep1.jpeg" alt="2024 Award 1" width={3024} height={4032} />
              <AwardPhotoLink src="/img/Premio/homep2.jpeg" alt="2024 Award 2" width={2048} height={2048} />
            </div>
          </div>

          {/* 2023 Awards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: 2023 Text */}
            <div>
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-brown mb-2">
                    Top 20 Nationwide
                  </h2>
                  <div className="text-6xl md:text-8xl font-bold text-brand-accent mb-3 leading-none">
                    2023
                  </div>
                  <p className="text-brand-muted text-sm md:text-base">
                    Ranked among the top 20 desserts across the country for taste and creativity.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: 2023 Images */}
            <div className="grid grid-cols-2 gap-4">
              <AwardPhotoLink src="/img/Premio/prime.jpeg" alt="2023 Award 1" width={1080} height={1920} objectPosition="top" />
              <AwardPhotoLink src="/img/Premio/homep.jpeg" alt="2023 Award 2" width={4032} height={3024} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
