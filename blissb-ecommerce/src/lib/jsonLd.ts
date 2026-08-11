import type { Product } from "@/data/products";
import type { EventItem } from "@/services/events";
import { getProductUrl } from "@/lib/productUrl";
import { isOutOfStock } from "@/lib/stock";

// Same production URL used across metadata (layout/robots/sitemap). NEXT_PUBLIC_
// so it's also inlined for the client components that build product schema.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blissbbakery.com";

// Structured-data URLs must be absolute. Strapi media already comes back
// absolute (returned as-is); local paths get the site origin prepended.
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

// Product + Offer. `availability` mirrors the same stock rule the storefront
// uses, so Google's rich result never says "in stock" for a sold-out item.
export function buildProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(product.image ? { image: [absoluteUrl(product.image)] } : {}),
    category: product.category,
    brand: { "@type": "Brand", name: "Bliss-B Desserts" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(getProductUrl(product)),
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: isOutOfStock(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Bliss-B Desserts" },
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildEventJsonLd(event: EventItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.date ? { startDate: event.date } : {}),
    ...(event.info ? { description: event.info } : {}),
    ...(event.flyer ? { image: [absoluteUrl(event.flyer)] } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.location ? { location: { "@type": "Place", name: event.location } } : {}),
    organizer: { "@type": "Organization", name: "Bliss-B Desserts", url: SITE_URL },
  };
}

export function buildFaqJsonLd(entries: { question: string; answerText: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answerText },
    })),
  };
}
