
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cookies", label: "Cookies" },
  { href: "/cakes", label: "Cakes" },
  { href: "/desserts", label: "Desserts" },
  { href: "/corporate", label: "Corporate" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#8F4B2B] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Navigation */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-[#EFC596]">
              Quick Links
            </h3>
            <nav className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {NAVIGATION_LINKS.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className="text-white hover:text-[#EFC596] hover:bg-white/10 justify-start px-0 h-auto py-2 font-normal rounded-md transition-all duration-200"
                >
                  <Link href={link.href} className="text-sm">
                    {link.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          {/* Center: Newsletter Signup */}
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-[#EFC596]">
              Stay Sweet with Us
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Be the first to know about new cookie launches,
              special promotions, and exclusive surprises we've
              baked just for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50 focus-visible:border-white rounded-md h-11"
              />
              <Button
                type="submit"
                className="w-full bg-[#EFC596] text-[#8F4B2B] hover:bg-[#EFC596]/90 rounded-md font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Subscribe Now
              </Button>
            </form>
          </div>

          {/* Right: Instagram */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-[#EFC596]">
              Follow Our Journey
            </h3>

            {/* Instagram Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="aspect-square p-0 bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 text-white/60 text-xs rounded-md transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <Link href="#" className="flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-sm flex items-center justify-center">
                      📸
                    </div>
                  </Link>
                </Button>
              ))}
            </div>

            <Button
              asChild
              variant="ghost"
              className="text-white/90 hover:text-[#EFC596] hover:bg-white/10 p-0 h-auto rounded-md"
            >
              <Link
                href="https://instagram.com/bliss-b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span>Follow</span>
                <span className="text-[#EFC596]">@bliss-b</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Bliss-B Bakery</h2>
            <p className="text-white/80 text-sm max-w-md mx-auto">
              Creating sweet moments and delicious memories, one cookie at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1E7A31] border-t border-[#1E7A31]/50">
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center md:text-left text-sm text-white/90">
              © 2025 Bliss-B Bakery. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 h-auto rounded-md text-xs"
              >
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 h-auto rounded-md text-xs"
              >
                <Link href="/terms">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}