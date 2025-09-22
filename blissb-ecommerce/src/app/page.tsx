import { Hero } from "@/components/Hero";
import Banner from "@/components/Banner";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import { ProductTabs } from "@/components/ProductTabs";
import { FAQ } from "@/components/Faq";
import { Awards } from "@/components/Awards";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Banner />
      <ProductTabs />
      <FAQ />
      <Awards />
    </main>
  );
}
