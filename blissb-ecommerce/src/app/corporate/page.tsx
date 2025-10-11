"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";
import { motion } from "framer-motion";

export default function CorporatePage() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section - Catering & Events */}
      <section className="py-12 md:py-16 bg-white">
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
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#C08552] mb-4 md:mb-6"
              >
                Catering & Events
              </motion.h1>

              <div className="space-y-3 md:space-y-4 text-[#6E5B4E] mb-6 md:mb-8 text-sm md:text-base">
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
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Cookie Cups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Mini Grans Cheesecake</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">NY Style Cookies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Mini NY Style Cookies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Mini Brownies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Lemon Pie Shots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Tres Leches Shots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                  <span className="text-[#6E5B4E]">Mini Alfajores</span>
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
              >
                <Button
                  variant="outline"
                  className="border-[#C08552] text-[#C08552] hover:bg-[#C08552] hover:text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
                >
                  Hire us
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
      <WaveDivider direction="top" color="#ffff" className="absolute bottom-0 left-0 right-0"/>
      {/* Corporate Gifting Section */}
      <section className="py-16 bg-[#F8EDE4]">
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#C08552] mb-4 md:mb-6">
                Corporate Gifting
              </h2>

              <div className="space-y-3 md:space-y-4 text-[#6E5B4E] mb-6 md:mb-8 text-sm md:text-base">
                <p>
                  Don't worry, we're here for you, whether you're celebrating
                  work anniversaries, welcoming new hires, celebrating
                  milestones or sending holiday gifts. We have both pre-made and
                  custom corporate gift options - or make a simple, self-service
                  option to save you time, and a concierge option if you're
                  looking for something bespoke.
                </p>
                <Button
                variant="outline"
                className="border-[#C08552] bg-[#F8EDE4] text-[#C08552] hover:bg-[#C08552] hover:text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              >
                Talk with us
              </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
        <WaveDivider direction="bottom" color="#ffff" className="absolute bottom-0 left-0 right-0"/>

      {/* Cookie Cart Experience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#C08552] mb-4 md:mb-6">
                Cookie Cart
                <br />
                Experience
              </h2>

              <div className="space-y-3 md:space-y-4 text-[#6E5B4E] mb-6 md:mb-8 text-sm md:text-base">
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
                <p className="font-semibold text-[#3B2A22] mb-3 md:mb-4 text-sm md:text-base">
                  The Bliss-B cart is perfect for:
                </p>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                    <span className="text-[#6E5B4E]">Weddings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                    <span className="text-[#6E5B4E]">Birthday parties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                    <span className="text-[#6E5B4E]">Corporate events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                    <span className="text-[#6E5B4E]">Private celebrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#1E7A31] rounded-full flex-shrink-0"></div>
                    <span className="text-[#6E5B4E]">
                      Pop-ups or brand launches
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="border-[#C08552] text-[#C08552] hover:bg-[#C08552] hover:text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              >
                Talk with us
              </Button>
            </div>

            {/* Right Content - Cart Images */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] order-1 lg:order-2">
              <Image
                src="/img/cart.png"
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
