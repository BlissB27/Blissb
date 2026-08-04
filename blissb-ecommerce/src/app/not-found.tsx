"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { House, Cookie, CakeSlice, IceCreamCone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/WaveDivider";

const CATEGORIES = [
  { href: "/cookies", label: "Cookies", Icon: Cookie },
  { href: "/cakes", label: "Cakes", Icon: CakeSlice },
  { href: "/desserts", label: "Desserts", Icon: IceCreamCone },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <section className="relative flex-1 flex items-center justify-center px-4 py-16 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="max-w-lg text-center"
        >
        <div className="text-7xl font-bold text-brand-accent mb-2 leading-none">404</div>

        <h1 className="text-2xl md:text-3xl font-bold text-brand-brown mb-3">
          This page isn&apos;t on the menu
        </h1>
        <p className="text-brand-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you
          back to something sweet.
        </p>

        <Button asChild size="lg" className="mb-8">
          <Link href="/">
            <House className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Back to home
          </Link>
        </Button>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {CATEGORIES.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 text-sm text-brand-muted hover:border-brand-brown hover:text-brand-brown transition-colors"
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </motion.div>

      <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />
    </section>
    </div>
  );
}
