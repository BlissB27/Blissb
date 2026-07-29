"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { motion } from "framer-motion";

const PHONE_NUMBER = "+14708835035";
const EMAIL = "blissbdesserts@gmail.com";

function mailtoFor(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    "Hi Bliss-B Desserts,\n\nEvent date:\nGuest count:\nBudget range:\n\nThanks!"
  )}`;
}

const SECTION_IDS = ["catering", "corporate-gifting", "cookie-cart"];

export function CorporateContent() {
  const phoneNumber = PHONE_NUMBER;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Scroll to the requested section (from Banner's CTAs), then strip the query
  // param so the URL bar stays clean — no #hash or ?section= left behind.
  useEffect(() => {
    const section = searchParams.get("section");
    if (section && SECTION_IDS.includes(section)) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      router.replace("/corporate", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen ">
      {/* Booking basics - the numbers a corporate/event buyer needs before reaching out */}
      <div className="bg-brand-bg border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center text-sm text-brand-text">
          <span className="flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-brand-brown" aria-hidden="true" />
            Book at least 2 weeks before your event
          </span>
          <span className="hidden sm:inline text-brand-border">•</span>
          <span>Every quote is custom to your guest count and menu — request one below</span>
        </div>
      </div>
      {/* Hero Section - Catering & Events */}
      <section id="catering" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
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
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 md:mb-6"
              >
                Catering & Events
              </motion.h1>

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
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Cookie Cups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Mini Grand Cheesecake</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">NY Style Cookies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Mini NY Style Cookies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Mini Brownies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Lemon Pie Shots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Tres Leches Shots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                  <span className="text-brand-muted">Mini Alfajores</span>
                </div>
              </div>

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
                  variant="outline"
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={`sms:${phoneNumber}?body=Hi! I'm interested in hiring Bliss-B for catering and events.`}>
                    Text Us
                  </a>
                </Button>
                <Button
                  asChild
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={mailtoFor("Catering Quote Request")}>Email Us</a>
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
                src="/img/catering.png"
                alt="Cookie Cups"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>
      <WaveDivider direction="top" color="#FFFFFF" className="absolute bottom-0 left-0 right-0"/>
      {/* Corporate Gifting Section */}
      <section id="corporate-gifting" className="py-16 bg-brand-bg scroll-mt-24">
        <div className="max-w-6xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Gift Boxes */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] order-2 lg:order-1">
              <Image
                src="/img/Corporate.png"
                alt="Corporate Gift Box with Cookies"
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Right Content */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 md:mb-6">
                Corporate Gifting
              </h2>

              <div className="space-y-3 md:space-y-4 text-brand-muted mb-6 md:mb-8 text-sm md:text-base">
                <p>
                  Don't worry, we're here for you, whether you're celebrating
                  work anniversaries, welcoming new hires, celebrating
                  milestones or sending holiday gifts. We have both pre-made and
                  custom corporate gift options - or make a simple, self-service
                  option to save you time, and a concierge option if you're
                  looking for something bespoke.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                  >
                    <a href={`sms:${phoneNumber}?body=Hi! I'm interested in corporate gifting options from Bliss-B.`}>
                      Text Us
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                  >
                    <a href={mailtoFor("Corporate Gifting Inquiry")}>Email Us</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        <WaveDivider direction="bottom" color="#FFFFFF" className="absolute bottom-0 left-0 right-0"/>

      {/* Cookie Cart Experience Section */}
      <section id="cookie-cart" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-brown mb-4 md:mb-6">
                Cookie Cart
                <br />
                Experience
              </h2>

              <div className="space-y-3 md:space-y-4 text-brand-muted mb-6 md:mb-8 text-sm md:text-base">
                <p>
                  Want to bring the full Bliss-B magic to your event? Our
                  signature cookie cart is available for on-site service!
                </p>
                <p>
                  You choose your cookie flavors, and we'll handle the rest from
                  setup to serving. Think of it like an ice cream cart, but with
                  fresh-baked cookies and premium toppings like Oreos, Biscoff
                  crumble, marshmallows, sprinkles, and more.
                </p>
              </div>

              <div className="mb-6 md:mb-8">
                <p className="font-semibold text-brand-text mb-3 md:mb-4 text-sm md:text-base">
                  The Bliss-B cart is perfect for:
                </p>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                    <span className="text-brand-muted">Weddings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                    <span className="text-brand-muted">Birthday parties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                    <span className="text-brand-muted">Corporate events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                    <span className="text-brand-muted">Private celebrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-success rounded-full flex-shrink-0"></div>
                    <span className="text-brand-muted">
                      Pop-ups or brand launches
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={`sms:${phoneNumber}?body=Hi! I'm interested in the Bliss-B Cookie Cart Experience for my event.`}>
                    Text Us
                  </a>
                </Button>
                <Button
                  asChild
                  className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 w-full sm:w-auto"
                >
                  <a href={mailtoFor("Cookie Cart Booking")}>Email Us</a>
                </Button>
              </div>
            </div>

            {/* Right Content - Cart Images */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] order-1 lg:order-2">
              <Image
                src="/img/carrito.jpeg"
                alt="Bliss-B Cookie Cart at Event"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
