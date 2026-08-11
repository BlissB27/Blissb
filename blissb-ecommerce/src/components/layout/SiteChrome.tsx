"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { ParallaxFooter } from "./ParallaxFooter";
import { CheckoutHeader } from "./CheckoutHeader";
import { CartDrawer } from "@/components/CartDrawer";
import { NewsletterDiscountModal } from "@/components/NewsletterDiscountModal";
import { SeasonalDecorations } from "@/components/SeasonalDecorations";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

// Routes that are part of the paid checkout flow get a distraction-free shell —
// no header nav, no footer, no cart drawer, no newsletter popup — matching how
// Shopify hides site chrome once the customer commits to checking out.
const DISTRACTION_FREE_PREFIXES = ["/checkout", "/order-success"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDistractionFree = DISTRACTION_FREE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  // Adornos estacionales del preset activo en Strapi. Sólo en el shell normal;
  // el checkout se mantiene sin distracciones.
  const { decoration } = useSeasonalTheme();

  if (isDistractionFree) {
    // /checkout renders its own logo inline (above the total, Stripe-style)
    // instead of a separate top bar — /order-success still gets the bar.
    const showCheckoutHeader = !pathname.startsWith("/checkout");
    return (
      <div className="h-screen flex flex-col">
        {showCheckoutHeader && <CheckoutHeader />}
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <>
      <ParallaxFooter>
        <Header />
        <main className="mx-auto  ">{children}</main>
      </ParallaxFooter>
      <CartDrawer />
      <NewsletterDiscountModal />
      <SeasonalDecorations decoration={decoration} />
    </>
  );
}
