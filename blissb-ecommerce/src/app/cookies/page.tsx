import type { Metadata } from "next";
import { Cookie, Package, Star } from "lucide-react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Cookies | Bliss-B Desserts",
  description: "Handcrafted cookies baked fresh to order in Braselton, GA. Mix and match flavors — 4 cookie minimum per order.",
};

export default function CookiesPage() {
  return (
    <CategoryPageTemplate
      category="cookies"
      Icon={Cookie}
      title="Our Cookie Collection"
      categoryLabel="Cookies"
      optionLabel="cookie variety"
      optionLabelPlural="cookie varieties"
      blurb="Handcrafted with premium ingredients and baked fresh to order. Remember: minimum 4 cookies total required per order."
      infoCards={[
        {
          Icon: Cookie,
          title: "Freshly Baked",
          description: "Made to order and shipped fresh every Monday for optimal taste and texture.",
        },
        {
          Icon: Package,
          title: "Minimum Order",
          description: "4 cookies minimum per order. Mix and match any flavors you like!",
        },
        {
          Icon: Star,
          title: "Premium Quality",
          description: "Made with high-quality ingredients and traditional baking methods.",
        },
      ]}
    />
  );
}
