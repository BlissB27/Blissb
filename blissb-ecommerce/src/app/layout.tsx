import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blisb Bakery store",
  description: "Store Blissb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className="min-h-screen bg-[#F8EDE4] text-[#3B2A22]">
        <Header />
        <main className="mx-auto  ">{children}</main>
        <Footer/>
        <CartDrawer/>
      </body>
    </html>
  );
}
