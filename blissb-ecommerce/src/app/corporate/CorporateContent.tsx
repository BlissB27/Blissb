"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CalendarClock, MapPin, Mail, Sparkles } from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { CorporateHero } from "@/components/category/CorporateHero";
import { RichText } from "@/components/RichText";
import type { HeroConfig } from "@/services/heroes";
import type { GalleryPhoto } from "@/services/gallery";
import type { CorporateSection } from "@/services/corporateSections";
import { motion } from "framer-motion";

const EMAIL_HREF = "mailto:blissbdesserts@gmail.com";

const SECTION_IDS = ["catering", "corporate-gifting", "cookie-cart"];

// Fotos por defecto — se usan si la dueña no ha cargado ninguna en Strapi
// (colección "Gallery Photo"). Real event/product photography, no stock.
const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: "/img/event1.jpeg", alt: "The Bliss-B cart set up on-site at an event", width: 3024, height: 4032 },
  { src: "/img/carrito.jpeg", alt: "The Bliss-B dessert cart styled for an event", width: 1024, height: 1043 },
  { src: "/img/catering1.jpeg", alt: "Plated mini tarts for a catered event", width: 3024, height: 4032 },
  { src: "/img/corporate1.jpeg", alt: "A Bliss-B cookie box presented as a corporate gift", width: 5107, height: 3648 },
  { src: "/img/corporate.jpeg", alt: "Cookies branded with the Bliss-B logo for corporate gifting", width: 3024, height: 4032 },
];

const FEATURES = [
  {
    Icon: CalendarClock,
    title: "Book 2 Weeks Ahead",
    description: "Give us at least two weeks' notice so every order gets the care and prep time it deserves.",
  },
  {
    Icon: Sparkles,
    title: "Custom Quotes",
    description: "Every quote is tailored to your guest count, menu, and budget — never a generic package.",
  },
  {
    Icon: MapPin,
    title: "Serving Braselton & Beyond",
    description: "Based in Braselton, GA, with cart service and delivery available for nearby events.",
  },
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

      {/* Booking basics - the numbers a corporate/event buyer needs before reaching out */}
      <section className="relative bg-brand-bg">
        <WaveDivider direction="top" color="#9B562C" className="absolute left-0 right-0" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.Icon className="w-7 h-7 text-white" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-brand-text mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider direction="bottom" color="#FFFFFF" className="absolute bottom-0 left-0 right-0" />
      </section>
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

            {/* Right Content - Cookie Images Grid */}
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
              className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] order-1 md:order-2"
            >
              <Image
                src={catering?.image || "/img/catering.png"}
                alt={catering?.imageAlt || "Cookie Cups"}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
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
                src={gifting?.image || "/img/Corporate.png"}
                alt={gifting?.imageAlt || "Corporate Gift Box with Cookies"}
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
                src={cart?.image || "/img/carrito.jpeg"}
                alt={cart?.imageAlt || "Bliss-B Cookie Cart at Event"}
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
