
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Handbag, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { SearchModal } from "../SearchModal";
import { useHydrated } from "@/hooks/useHydrated";
import { Carrusel } from "../Carrusel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/cookies", label: "Cookies" },
  { href: "/cakes", label: "Cakes" },
  { href: "/desserts", label: "Desserts" },
];

const SERVICES = [
  { href: "/corporate", label: "Corporate & Catering" },
  
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
     <Handbag />
      
     
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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E6D7CB]/50 transition-all duration-300">
        {/* Announcement */}
        <Carrusel/>

        {/* Main nav */}
        <div className=" border-b-0.5 border-[#E6D7CB]">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
            {/* Left: Logo + mobile toggle */}
            <div className="flex w-full items-center justify-between md:w-auto md:justify-start gap-4 md:gap-6">
              {/* Mobile: menu toggle */}
              <button
                className="md:hidden text-[#6E5B4E] hover:text-[#8F4B2B] p-1 rounded-md hover:bg-[#F8EDE4] transition-all duration-200"
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
                className="text-lg font-bold tracking-wide text-[#8F4B2B]"
              >
                <Image
                  src="/img/logobb.png"
                  width={300}
                  height={200}
                  alt="logo"
                />
              </Link>

              <div className="md:hidden">
                <CartButton />
              </div>
            </div>

            {/* Center nav (desktop only) */}
            <nav className="hidden md:flex gap-6 items-center">
              {NAV.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-sm transition-all duration-200 px-3 py-2 rounded-md hover:bg-[#F8EDE4] ${
                      isActive
                        ? "text-[#8F4B2B] font-medium"
                        : "text-[#6E5B4E] hover:text-[#8F4B2B]"
                    }`}
                  >
                    {item.label}
                    {/* Underline animation */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8F4B2B] rounded-full animate-in slide-in-from-left-full duration-300" />
                    )}
                  </Link>
                );
              })}

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-[#6E5B4E] hover:text-[#8F4B2B] transition-colors focus:outline-none relative  duration-200 px-3 py-2 rounded-md hover:bg-[#F8EDE4]">
                  Services
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-45">
                  {SERVICES.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <Link
                        href={service.href}
                        className="w-full text-[#6E5B4E] hover:text-[#8F4B2B] focus:text-[#8F4B2B] relative text-sm transition-all duration-200 px-3 py-2 rounded-md "
                      >
                        {service.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Contact us */}
              <Link
                href="/contact"
                className={`text-sm transition-colors relative  duration-200 px-3 py-2 rounded-md hover:bg-[#F8EDE4] ${
                  pathname.startsWith("/contact")
                    ? "text-[#8F4B2B] font-medium"
                    : "text-[#6E5B4E] hover:text-[#8F4B2B]"
                }`}
              >
                Contact us
              </Link>
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
              
              <CartButton />
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileOpen && (
            <nav className="md:hidden px-4 pb-6 animate-in slide-in-from-top-2 duration-300 fade-in-0">
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

                {/* Services dropdown in mobile */}
                <li>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex items-center justify-between w-full text-base text-[#6E5B4E] hover:text-[#8F4B2B] transition-colors"
                  >
                    Services
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <ul className="ml-4 mt-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                      {SERVICES.map((service) => {
                        const isActive = pathname.startsWith(service.href);
                        return (
                          <li key={service.href}>
                            <Link
                              href={service.href}
                              onClick={() => {
                                setIsMobileOpen(false);
                                setMobileServicesOpen(false);
                              }}
                              className={`block text-base transition-colors ${
                                isActive
                                  ? "text-[#8F4B2B] font-medium"
                                  : "text-[#6E5B4E] hover:text-[#8F4B2B]"
                              }`}
                            >
                              {service.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>

                {/* Contact us */}
                <li>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className={`block text-base ${
                      pathname.startsWith("/contact")
                        ? "text-[#8F4B2B] font-medium"
                        : "text-[#6E5B4E] hover:text-[#8F4B2B]"
                    }`}
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}