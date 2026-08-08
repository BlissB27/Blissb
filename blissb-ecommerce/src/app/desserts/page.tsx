import type { Metadata } from "next";
import { IceCream, Snowflake, Sparkles, Utensils } from "lucide-react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { DessertsHero } from "@/components/category/DessertsHero";
import { getProductsByCategoryAsync, type Product } from "@/data/products";

export const metadata: Metadata = {
  title: "Desserts | Bliss-B Desserts",
  description: "Gourmet individual desserts crafted with precision and care, handmade in Braselton, GA.",
  alternates: { canonical: "/desserts" },
};

export default async function DessertsPage() {
  // Fetched here (server-side), same reasoning as Cookies/Cakes: the hero's
  // photos render with real data on the first paint, no client-side Strapi
  // round trip to wait on after hydration.
  let desserts: Product[] = [];
  try {
    desserts = await getProductsByCategoryAsync("desserts");
  } catch (error) {
    console.error("Error loading desserts:", error);
  }

  return (
    <CategoryPageTemplate
      category="desserts"
      Icon={IceCream}
      hero={<DessertsHero desserts={desserts} />}
      title="Gourmet Desserts"
      categoryLabel="Desserts"
      blurb="Elegant desserts, crafted with the same precision and care as everything we bake. From cookie fries perfect for sharing to individually portioned brownies, cookie cups, and alfajores, each one is designed to be the perfect ending to any occasion."
      infoCards={[
        {
          Icon: Utensils,
          title: "Individual Portions",
          description: "Perfect single servings designed for optimal enjoyment. Each dessert is portioned for the ideal experience.",
        },
        {
          Icon: Snowflake,
          title: "Best Fresh",
          description: "Best consumed within 2-3 days of delivery. Store refrigerated and serve at room temperature.",
        },
        {
          Icon: Sparkles,
          title: "Premium Ingredients",
          description: "Made with authentic ingredients and traditional techniques for exceptional flavor and texture.",
        },
      ]}
    />
  );
}
