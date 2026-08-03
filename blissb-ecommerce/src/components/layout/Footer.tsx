import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FooterSubscribeForm } from "./FooterSubscribeForm";

const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cookies", label: "Cookies" },
  { href: "/cakes", label: "Cakes" },
  { href: "/desserts", label: "Desserts" },
  { href: "/corporate", label: "Corporate & Catering" },
  { href: "/contact", label: "Contact Us" },
];

function FooterNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative text-sm text-white/85 hover:text-white transition-colors">
      {label}
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-white transition-[clip-path] duration-300 ease-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0%_0_0)]" />
    </Link>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20"
    >
      <span className="absolute inset-0 origin-top scale-y-0 bg-white transition-transform duration-300 group-hover:scale-y-100" />
      <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#5C3319]">
        {children}
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#5C3319] text-white shadow-[0_50vh_0_60vh_#5C3319]">
      <div className="mx-auto max-w-[1200px] px-4 py-14 flex flex-col items-center text-center">
        <Link href="/">
          <Image src="/img/logo-white.png" alt="Bliss-B Desserts" width={1343} height={452} className="h-10 md:h-12 w-auto" />
        </Link>

        <p className="mt-4 max-w-md text-sm text-white/75">
          Small-batch cookies, cakes, and desserts, handcrafted fresh in Braselton, GA.
        </p>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {NAVIGATION_LINKS.map((link) => (
            <FooterNavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-center gap-3">
            <SocialIcon href="https://instagram.com/blissb.bakery" label="Bliss-B Desserts on Instagram">
              <Instagram className="h-4 w-4" strokeWidth={1.75} />
            </SocialIcon>
            <SocialIcon href="https://tiktok.com/@blissb.bakery" label="Bliss-B Desserts on TikTok">
              <FaTiktok className="h-4 w-4" />
            </SocialIcon>
          </div>
          <FooterSubscribeForm />
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row sm:justify-center sm:gap-4">
          <p>© {new Date().getFullYear()} Bliss-B Desserts. All rights reserved.</p>
          <span className="hidden sm:inline">•</span>
          <Link href="/policies" className="hover:text-white transition-colors">
            Shipping &amp; Policies
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
