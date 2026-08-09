import type { Metadata } from "next";
import { Cookie, Palette, Star } from "lucide-react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { CookiesHero } from "@/components/category/CookiesHero";
import { getProductBySlug } from "@/data/products";
import { getHero } from "@/services/heroes";

// The real Strapi slug for the Mini Cookie Box product.
const MINI_COOKIE_BOX_SLUG = "MiniCookie-box";

export const metadata: Metadata = {
  title: "Cookies | Bliss-B Desserts",
  description: "Handcrafted cookies baked fresh to order in Braselton, GA. Mix and match flavors — 4 cookie minimum per order.",
  alternates: { canonical: "/cookies" },
};

export default async function CookiesPage() {
  // Fetched here (server-side) instead of in CookiesHero so the hero's button
  // and image can animate on the same deterministic timeline — no client-side
  // Strapi round trip to wait on before the CTA is fully interactive.
  // El producto destacado y los textos son editables desde Strapi (Hero
  // key="cookies"); si no hay override, se usa el Mini Cookie Box por defecto.
  const hero = await getHero("cookies");
  const featured = await getProductBySlug(hero?.featuredProductSlug || MINI_COOKIE_BOX_SLUG);

  return (
    <CategoryPageTemplate
      category="cookies"
      Icon={Cookie}
      hero={<CookiesHero product={featured} hero={hero} />}
      title="Our Cookie Collection"
      categoryLabel="Cookies"
      blurb="Handcrafted with premium ingredients and baked fresh to order. Remember: minimum 4 cookies total required per order."
      infoCards={[
        {
          Icon: Cookie,
          title: "Freshly Baked",
          description: "Made to order and shipped fresh every Monday for optimal taste and texture.",
        },
        {
          Icon: Palette,
          title: "Wide Flavor Variety",
          description: "From classic chocolate chip to red velvet, Biscoff, and more — mix and match your favorites.",
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
