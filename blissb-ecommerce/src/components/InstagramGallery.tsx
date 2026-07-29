"use client";

import Image from "next/image";
import Link from "next/link";
import BeholdWidget from "@behold/react";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { Instagram } from "lucide-react";

const BEHOLD_FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;

// Static fallback so the section never breaks before the Behold feed is configured.
const GALLERY_IMAGES = [
  "/img/cakec.png",
  "/img/cake2.png",
  "/img/chocob.JPG",
  "/img/samba.JPG",
  "/img/chips.JPG",
  "/img/catering1.jpeg",
];

export function InstagramGallery() {
  return (
    <section className="relative bg-brand-bg">
      <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />

      <div className="mx-auto max-w-[1200px] px-4 py-14 md:py-16 my-10 md:my-14">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-brown mb-2">
            Follow Along
          </h2>
          <p className="text-brand-muted text-sm md:text-base">
            More from the kitchen on Instagram
          </p>
        </div>

        {BEHOLD_FEED_ID ? (
          <div className="max-w-2xl mx-auto mb-6">
            <BeholdWidget feedId={BEHOLD_FEED_ID} />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto mb-6">
            {GALLERY_IMAGES.map((src) => (
              <a
                key={src}
                href="https://instagram.com/blissb.bakery"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 200px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-brand-text/0 group-hover:bg-brand-text/40 transition-colors duration-200">
                  <Instagram
                    className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    strokeWidth={1.75}
                  />
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="https://instagram.com/blissb.bakery" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4" strokeWidth={1.75} />
              Follow @blissb.bakery
            </Link>
          </Button>
        </div>
      </div>

      <WaveDivider direction="bottom" color="#ffffff" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
