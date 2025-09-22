
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Navigation */}
          <div>
            <nav className="space-y-3">
              {NAVIGATION_LINKS.map((link) => (
                <div key={link.href}>
                  <Button asChild variant="link" className="text-white hover:text-[#EFC596] p-0 h-auto font-normal">
                    <Link href={link.href} className="text-sm">
                      {link.label}
                    </Link>
                  </Button>
                </div>
              ))}
            </nav>
          </div>

          {/* Center: Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Sign up and sweeten your inbox
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Be the first to know about new cookie launches, 
              special promotions, and exclusive surprises we've 
              baked just for you.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50 rounded-full"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto bg-white text-[#8F4B2B] hover:bg-white/90 rounded-full font-medium"
              >
                Send
              </Button>
            </form>
          </div>

          {/* Right: Instagram */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Instagram</h3>
            
            {/* Instagram Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="aspect-square p-0 bg-white/10 border-white/20 hover:bg-white/20 text-white/50 text-xs"
                  asChild
                >
                  <Link href="#" className="flex items-center justify-center">
                    foto
                  </Link>
                </Button>
              ))}
            </div>

            <Button asChild variant="link" className="text-white/90 hover:text-white p-0 h-auto">
              <Link
                href="https://instagram.com/bliss-b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                @bliss-b
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />
      
      {/* Bottom Bar */}
      <div className="bg-[#1E7A31]">
        <div className="mx-auto max-w-[1200px] px-4 py-4">
          <p className="text-center text-sm text-white">
            © Copyright Bliss-B 2025
          </p>
        </div>
      </div>
    </footer>
  );
}