import type { Metadata } from "next";
import { Cookie, Palette, Star } from "lucide-react";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { CookiesHero } from "@/components/category/CookiesHero";
import { getProductBySlug } from "@/data/products";

// The real Strapi slug for the Mini Cookie Box product.
const MINI_COOKIE_BOX_SLUG = "MiniCookie-box";

export const metadata: Metadata = {
  title: "Cookies | Bliss-B Desserts",
  description: "Handcrafted cookies baked fresh to order in Braselton, GA. Mix and match flavors — 4 cookie minimum per order.",
};

export default async function CookiesPage() {
  // Fetched here (server-side) instead of in CookiesHero so the hero's button
  // and image can animate on the same deterministic timeline — no client-side
  // Strapi round trip to wait on before the CTA is fully interactive.
  const miniCookieBox = await getProductBySlug(MINI_COOKIE_BOX_SLUG);

  return (
    <CategoryPageTemplate
      category="cookies"
      Icon={Cookie}
      hero={<CookiesHero product={miniCookieBox} />}
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
