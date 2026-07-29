import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Header from "@/components/layout/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { NewsletterDiscountModal } from "@/components/NewsletterDiscountModal";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bliss-B Desserts | Braselton, GA Bakery",
  description: "Small-batch cookies, cakes, and desserts handcrafted in Braselton, GA. Order online for pickup, local delivery, or nationwide shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className={`${bricolageGrotesque.variable} ${inter.variable} min-h-screen bg-brand-bg text-brand-text font-sans antialiased`}>
        <MotionConfig reducedMotion="user">
          <Header />
          <main className="mx-auto  ">{children}</main>
          <Footer/>
          <CartDrawer/>
          <NewsletterDiscountModal/>
        </MotionConfig>
      </body>
    </html>
  );
}
