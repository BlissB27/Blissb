"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail } from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { CorporateHero } from "@/components/category/CorporateHero";
import { RichText } from "@/components/RichText";
import type { HeroConfig } from "@/services/heroes";
import type { GalleryPhoto } from "@/services/gallery";
import type { CorporateSection, CorporateSectionImage } from "@/services/corporateSections";
import { motion } from "framer-motion";

const EMAIL_HREF = "mailto:blissbdesserts@gmail.com";

const SECTION_IDS = ["catering", "corporate-gifting", "cookie-cart"];

// Fallback local para cada sección cuando Strapi no tiene fotos cargadas —
// mismo shape que CorporateSectionImage para poder compartir el render.
const CATERING_FALLBACK: CorporateSectionImage[] = [
  { url: "/img/catering.png", alt: "Cookie Cups" },
  { url: "/img/catering1.jpeg", alt: "Mini tartas servidas en un evento" },
  { url: "/img/corporate1.jpeg", alt: "Galletas Bliss-B decoradas para un evento" },
  { url: "/img/carrito.jpeg", alt: "Carrito de postres Bliss-B" },
];
const GIFTING_FALLBACK: CorporateSectionImage[] = [
  { url: "/img/Corporate.png", alt: "Corporate Gift Box with Cookies" },
];
const CART_FALLBACK: CorporateSectionImage[] = [
  { url: "/img/carrito.jpeg", alt: "Bliss-B Cookie Cart at Event" },
];

// Fotos por defecto — se usan si la dueña no ha cargado ninguna en Strapi
// (colección "Gallery Photo"). Real event/product photography, no stock.
const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: "/img/event1.jpeg", alt: "The Bliss-B cart set up on-site at an event", width: 3024, height: 4032 },
  { src: "/img/carrito.jpeg", alt: "The Bliss-B dessert cart styled for an event", width: 1024, height: 1043 },
  { src: "/img/catering1.jpeg", alt: "Plated mini tarts for a catered event", width: 3024, height: 4032 },
  { src: "/img/corporate1.jpeg", alt: "A Bliss-B cookie box presented as a corporate gift", width: 5107, height: 3648 },
  { src: "/img/corporate.jpeg", alt: "Cookies branded with the Bliss-B logo for corporate gifting", width: 3024, height: 4032 },
];

export function CorporateContent({
  hero,
  gallery,
  sections,
}: {
  hero?: HeroConfig | null;
  gallery?: GalleryPhoto[];
  sections?: Record<string, CorporateSection>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Fotos de Strapi si hay; si no, las de por defecto.
  const galleryPhotos = gallery && gallery.length > 0 ? gallery : GALLERY_PHOTOS;
  // Secciones editables desde Strapi (título, imagen+alt, cuerpo WYSIWYG); cada
  // campo cae a su valor por defecto si no está seteado.
  const catering = sections?.catering;
  const gifting = sections?.gifting;
  const cart = sections?.["cookie-cart"];
  const cateringImages = catering?.images?.length ? catering.images : CATERING_FALLBACK;
  const giftingImage = gifting?.images?.length ? gifting.images[0] : GIFTING_FALLBACK[0];
  const cartImage = cart?.images?.length ? cart.images[0] : CART_FALLBACK[0];

  // Scroll to the requested section (from Banner's CTAs), then strip the query
  // param so the URL bar stays clean — no #hash or ?section= left behind.
  useEffect(() => {
    const section = searchParams.get("section");
    if (section && SECTION_IDS.includes(section)) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      router.replace("/corporate", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#corporate-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    return () => lightbox.destroy();
  }, []);

  return (
    <div className="min-h-screen ">
      <CorporateHero hero={hero} />

      {/* Catering & Events */}
      <section id="catering" className="py-12 md:py-16 bg-white scroll-mt-[150px] md:scroll-mt-[185px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6
              }}
              className="order-2 md:order-1"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  delay: 0.2,
                  duration: 0.6
                }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 md:mb-6"
              >
                {catering?.title || "Catering & Events"}
              </motion.h2>

              {catering?.body ? (
                <RichText
                  content={catering.body}
                  className="text-brand-muted mb-6 md:mb-8 text-sm md:text-base"
                />
              ) : (
                <>
                  <div className="space-y-3 md:space-y-4 text-brand-muted mb-6 md:mb-8 text-sm md:text-base">
                    <p>Sweeten every celebration with our dessert catering.</p>
                    <p>
                      From weddings to birthdays, we create beautiful displays of
                      cookies and treats that make every moment unforgettable.
                    </p>
                    <p>
                      Our catering menu includes bite-sized versions of your Bliss-B
                      favorites:
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2 mb-6 md:mb-8 text-sm md:text-base">
                    {[
                      "Cookie Cups",
                      "Mini Grand Cheesecake",
                      "NY Style Cookies",
                      "Mini NY Style Cookies",
                      "Mini Brownies",
                      "Lemon Pie Shots",
                      "Tres Leches Shots",
                      "Mini Alfajores",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                        <span className="text-brand-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  delay: 0.4,
                  duration: 0.6
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  asChild
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={EMAIL_HREF} className="flex items-center gap-2">
                    <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Email us
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Content - stacked photos, however many the owner has uploaded in Strapi */}
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
              className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible md:gap-4 order-1 md:order-2 -mx-4 px-4 md:mx-0 md:px-0"
            >
              {cateringImages.map((img, i) => (
                <div
                  key={img.url + i}
                  className="relative flex-shrink-0 w-[70%] aspect-[2.4/1] md:w-full overflow-hidden rounded-full shadow-md"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 70vw, 50vw"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corporate Gifting Section */}
      <section id="corporate-gifting" className="relative bg-brand-bg scroll-mt-[150px] md:scroll-mt-[185px]">
        <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Gift Boxes */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] order-2 lg:order-1">
              <Image
                src={giftingImage.url}
                alt={giftingImage.alt}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Right Content */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 md:mb-6">
                {gifting?.title || "Corporate Gifting"}
              </h2>

              {gifting?.body ? (
                <RichText
                  content={gifting.body}
                  className="text-brand-muted mb-6 md:mb-8 text-sm md:text-base"
                />
              ) : (
                <div className="space-y-3 md:space-y-4 text-brand-muted mb-6 md:mb-8 text-sm md:text-base">
                  <p>
                    Don't worry, we're here for you, whether you're celebrating
                    work anniversaries, welcoming new hires, celebrating
                    milestones or sending holiday gifts.
                  </p>
                  <p>
                    <span className="font-semibold text-brand-text">
                      Corporate Gifts, made simple.
                    </span>{" "}
                    Choose from our curated gift options, ready to send, or tell
                    us your vision and we'll take care of every detail for you.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={EMAIL_HREF} className="flex items-center gap-2">
                    <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Email us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider direction="bottom" color="#FFFFFF" className="absolute bottom-0 left-0 right-0" />
      </section>

      {/* Cookie Cart Experience Section */}
      <section id="cookie-cart" className="py-16 bg-white scroll-mt-[150px] md:scroll-mt-[185px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 md:mb-6">
                {cart?.title || (
                  <>
                    Cookie Cart
                    <br />
                    Experience
                  </>
                )}
              </h2>

              {cart?.body ? (
                <RichText
                  content={cart.body}
                  className="text-brand-muted mb-6 md:mb-8 text-sm md:text-base"
                />
              ) : (
                <>
                  <div className="space-y-3 md:space-y-4 text-brand-muted mb-6 md:mb-8 text-sm md:text-base">
                    <p>
                      Want to bring the full Bliss-B magic to your event? Our
                      signature cookie cart is available for on-site service!
                    </p>
                    <p>
                      You choose your cookie flavors, and we'll handle the rest from
                      setup to serving. Think of it as a cookie bar, warm, fresh, and
                      finished with your choice of Oreos, Biscoff crumble,
                      marshmallows, sprinkles, and more.
                    </p>
                  </div>

                  <div className="mb-6 md:mb-8">
                    <p className="font-semibold text-brand-text mb-3 md:mb-4 text-sm md:text-base">
                      The Bliss-B cart is perfect for:
                    </p>

                    <div className="space-y-2 text-sm md:text-base">
                      {[
                        "Weddings",
                        "Birthday parties",
                        "Corporate events",
                        "Private celebrations",
                        "Pop-ups or brand launches",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                          <span className="text-brand-muted">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={EMAIL_HREF} className="flex items-center gap-2">
                    <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Email us
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Content - Cart Images */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] order-1 lg:order-2">
              <Image
                src={cartImage.url}
                alt={cartImage.alt}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery - proof of work for a buyer deciding whether to trust us with their event */}
      <section className="relative bg-brand-bg">
        <WaveDivider direction="top" color="#FFFFFF" className="absolute left-0 right-0" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-brown mb-3">
              See Us In Action
            </h2>
            <p className="text-brand-muted text-sm md:text-base max-w-2xl mx-auto">
              A look at real Bliss-B setups from past weddings, offices, and celebrations.
            </p>
          </div>

          <div id="corporate-gallery" className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryPhotos.map((photo) => (
              <a
                key={photo.src}
                href={photo.src}
                data-pswp-width={photo.width}
                data-pswp-height={photo.height}
                className="group relative block aspect-square cursor-pointer overflow-hidden rounded-lg border border-brand-border"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </a>
            ))}
          </div>
        </div>
        <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />
      </section>
    </div>
  );
}
