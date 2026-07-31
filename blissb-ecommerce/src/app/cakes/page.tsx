import type { Metadata } from "next";
import { Suspense } from "react";
import { CakesContent } from "./CakesContent";
import { getProductsByCategoryAsync, type Product } from "@/data/products";

export const metadata: Metadata = {
  title: "Cakes | Bliss-B Desserts",
  description: "Custom-made cakes with multiple flavor options, handcrafted for celebrations, birthdays, and special occasions in Braselton, GA.",
};

export default async function CakesPage() {
  // Fetched here (server-side), same reasoning as the Cookies hero: the hero
  // photos and feature sections render with real data on the first paint,
  // with no client-side Strapi round trip to wait on after hydration.
  let cakes: Product[] = [];
  try {
    cakes = await getProductsByCategoryAsync("cakes");
  } catch (error) {
    console.error("Error loading cakes:", error);
  }

  return (
    <Suspense>
      <CakesContent cakes={cakes} />
    </Suspense>
  );
}
