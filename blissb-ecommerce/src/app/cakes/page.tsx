import type { Metadata } from "next";
import { Cake, CalendarClock, ChefHat, Palette } from "lucide-react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

export const metadata: Metadata = {
  title: "Cakes | Bliss-B Desserts",
  description: "Custom-made cakes with multiple flavor options, handcrafted for celebrations, birthdays, and special occasions in Braselton, GA.",
};

export default function CakesPage() {
  return (
    <CategoryPageTemplate
      category="cakes"
      Icon={Cake}
      title="Our Cakes Collection"
      categoryLabel="Cakes"
      optionLabel="cake option"
      optionLabelPlural="cake options"
      blurb="Custom-made cakes with multiple flavor options. Perfect for celebrations, birthdays, and special occasions. Remember to select your preferred flavor!"
      infoCards={[
        {
          Icon: Palette,
          title: "Custom Flavors",
          description: "Choose from multiple flavor options for each cake. Each flavor is carefully crafted for the perfect taste.",
        },
        {
          Icon: CalendarClock,
          title: "Advance Notice",
          description: "Custom cakes require 24-48 hours advance notice for preparation and decoration.",
        },
        {
          Icon: ChefHat,
          title: "Handcrafted",
          description: "Each cake is individually crafted by our skilled bakers using premium ingredients and techniques.",
        },
      ]}
    />
  );
}
