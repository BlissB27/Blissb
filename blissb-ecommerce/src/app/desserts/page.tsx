import type { Metadata } from "next";
import { IceCream, Snowflake, Sparkles, Utensils } from "lucide-react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Desserts | Bliss-B Desserts",
  description: "Gourmet individual desserts crafted with precision and care, handmade in Braselton, GA.",
};

export default function DessertsPage() {
  return (
    <CategoryPageTemplate
      category="desserts"
      Icon={IceCream}
      title="Gourmet Desserts"
      categoryLabel="Desserts"
      optionLabel="dessert option"
      optionLabelPlural="dessert options"
      blurb="Indulgent desserts crafted with precision and care. From classic favorites to innovative creations, each dessert is a perfect ending to any meal."
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
