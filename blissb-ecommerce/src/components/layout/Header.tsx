
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { SearchModal } from "../SearchModal";
import { useHydrated } from "@/hooks/useHudrated";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/cookies", label: "Cookies" },
  { href: "/cakes", label: "Cakes" },
  { href: "/desserts", label: "Desserts" },
  { href: "/corporate", label: "Corporate" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact us" },
];

// Componente separado para el carrito que maneja la hidratación
function CartButton() {
  const { getTotalItems, toggleCart } = useCartStore();
  const hydrated = useHydrated();
  
  // Mostrar 0 items hasta que se hidrate para evitar diferencias
  const totalItems = hydrated ? getTotalItems() : 0;

  return (
    <button 
      onClick={toggleCart} 
      className="inline-block relative" 
      aria-label="Cart"
    >
      <span
        className="inline-flex h-9 w-9 items-center justify-center text-white bg-[#1E7A31]
          [clip-path:polygon(50%_0%,61%_6%,71%_18%,82%_29%,94%_39%,100%_50%,94%_61%,82%_71%,71%_82%,61%_94%,50%_100%,39%_94%,29%_82%,18%_71%,6%_61%,0%_50%,6%_39%,18%_29%,29%_18%,39%_6%)]
          shadow-sm"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M3 4h2l1 2h14a1 1 0 0 1 .94 1.34l-2 6A2 2 0 0 1 17.04 14H9.3l-.7 2h10.4v2H8a1 1 0 0 1-.95-1.32L8.1 13 5 6H3V4Zm6 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm9 0a2 2 0 1 0-.001-4.001A2 2 0 0 0 18 20Z" />
        </svg>
      </span>
      {/* Counter badge - solo mostrar cuando hay items y está hidratado */}
      {hydrated && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#8F4B2B] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {totalItems}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        {/* Announcement */}
        <div className="w-full bg-[#8F4B2B] text-white">
          <div className="mx-auto max-w-[1200px] px-4 py-2 text-center text-[13px]">
            Buy 4 Get 1 Free Today Only (Promo code applied at checkout)
          </div>
        </div>

        {/* Main nav */}
        <div className="border-b border-[#E6D7CB]">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
            {/* Left: Logo + mobile toggle */}
            <div className="flex w-full items-center justify-between md:w-auto md:justify-start gap-4 md:gap-6">
              {/* Mobile: menu toggle */}
              <button
                className="md:hidden text-[#6E5B4E]"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="text-lg font-bold tracking-wide text-[#8F4B2B]"
              >
                <Image
                  src="/img/Bliss-B-logo.png"
                  width={200}
                  height={200}
                  alt="logo"
                />
              </Link>

              {/* Cart icon - visible on mobile only */}
              <div className="md:hidden">
                <CartButton />
              </div>
            </div>

            {/* Center nav (desktop only) */}
            <nav className="hidden md:flex gap-6">
              {NAV.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors ${
                      isActive
                        ? "text-[#8F4B2B] font-medium"
                        : "text-[#6E5B4E] hover:text-[#8F4B2B]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-sm text-[#6E5B4E] hover:text-[#8F4B2B] transition-colors p-2 hover:bg-gray-50 rounded-md"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
              <Link
                href="/account"
                className="text-sm text-[#6E5B4E] hover:text-[#8F4B2B]"
              >
                Account
              </Link>
              <CartButton />
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileOpen && (
            <nav className="md:hidden px-4 pb-6 animate-in slide-in-from-top-2 duration-200">
              <ul className="space-y-3 mt-2">
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
                        className={`block text-base ${
                          isActive
                            ? "text-[#8F4B2B] font-medium"
                            : "text-[#6E5B4E] hover:text-[#8F4B2B]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}