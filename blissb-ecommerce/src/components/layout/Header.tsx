
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { SearchModal } from "../SearchModal";
import { useHydrated } from "@/hooks/useHydrated";
import { Carrusel } from "../Carrusel";
import { BrandLogo } from "../BrandLogo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/cookies", label: "Cookies" },
  { href: "/cakes", label: "Cakes" },
  { href: "/desserts", label: "Desserts" },
  { href: "/corporate", label: "Corporate & Catering" },
];

// Componente separado para el carrito que maneja la hidratación
function CartButton({
  className = "",
  iconClassName = "w-5 h-5",
}: {
  className?: string;
  iconClassName?: string;
}) {
  const { getTotalItems, toggleCart } = useCartStore();
  const hydrated = useHydrated();

  // Mostrar 0 items hasta que se hidrate para evitar diferencias
  const totalItems = hydrated ? getTotalItems() : 0;

  return (
    <button
      onClick={toggleCart}
      className={`inline-block relative text-brand-muted hover:text-brand-brown transition-colors ${className}`}
      aria-label="Cart"
    >
      <ShoppingCart className={iconClassName} strokeWidth={1.75} />

      {/* Counter badge - solo mostrar cuando hay items y está hidratado */}
      {hydrated && totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-brand-brown text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {totalItems}
        </span>
      )}
    </button>
  );
}

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative text-sm transition-colors duration-200 px-3 py-2 rounded-md hover:bg-brand-bg ${
        isActive ? "text-brand-brown font-medium" : "text-brand-muted hover:text-brand-brown"
      }`}
    >
      {label}
      <span
        className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-brand-brown transition-[clip-path] duration-300 ease-out ${
          isActive
            ? "[clip-path:inset(0_0%_0_0)]"
            : "[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0%_0_0)]"
        }`}
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border/50 transition-all duration-300">
        {/* Announcement */}
        <Carrusel/>

        {/* Main nav */}
        <div className="relative border-b-0.5 border-brand-border">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
            {/* Left: Logo + mobile toggle */}
            <div className="flex w-full items-center gap-4 lg:w-auto lg:justify-start lg:gap-6">
              {/* Mobile: menu toggle */}
              <button
                className="lg:hidden text-brand-muted hover:text-brand-brown p-1 rounded-md hover:bg-brand-bg transition-all duration-200"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                      isMobileOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                      isMobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
                    }`}
                  />
                </div>
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="text-lg font-bold tracking-wide text-brand-brown flex flex-1 items-center justify-center gap-2 lg:flex-none lg:justify-start"
              >
                <BrandLogo
                  variant="main"
                  width={300}
                  height={200}
                  alt="logo"
                  className="h-14 lg:h-20 w-auto"
                  style={{ width: 'auto' }}
                  priority
                />
                <Image
                  src="/img/blisbpremio.png"
                  width={79}
                  height={112}
                  alt="Best of Georgia 2025"
                  className="block h-14 lg:h-28 w-auto"
                  style={{ width: 'auto' }}
                />
              </Link>

              <div className="lg:hidden">
                <CartButton
                  className="p-1 rounded-md hover:bg-brand-bg transition-all duration-200"
                  iconClassName="h-6 w-6"
                />
              </div>
            </div>


            <nav className="hidden lg:flex gap-6 items-center">
              {NAV.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return <NavLink key={item.href} href={item.href} label={item.label} isActive={isActive} />;
              })}

              {/* Contact us */}
              <NavLink href="/contact" label="Contact us" isActive={pathname.startsWith("/contact")} />
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-brand-muted hover:text-brand-brown transition-colors p-2 hover:bg-brand-bg rounded-md"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" strokeWidth={1.75} />
              </button>

              <CartButton />
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMobileOpen && (
              <motion.nav
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden absolute left-0 right-0 top-full z-40 bg-white/95 backdrop-blur-sm rounded-b-2xl border-b border-brand-border shadow-lg overflow-hidden"
              >
                <ul className="space-y-3 px-4 pt-4 pb-6">
                  {NAV.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`block text-center text-base ${
                            isActive
                              ? "text-brand-brown font-medium"
                              : "text-brand-muted hover:text-brand-brown"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}

                  {/* Contact us */}
                  <li>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileOpen(false)}
                      className={`block text-center text-base ${
                        pathname.startsWith("/contact")
                          ? "text-brand-brown font-medium"
                          : "text-brand-muted hover:text-brand-brown"
                      }`}
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}