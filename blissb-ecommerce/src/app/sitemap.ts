import type { MetadataRoute } from "next";
import { getAllProducts } from "@/data/products";
import { getProductUrl } from "@/lib/productUrl";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blissbbakery.com";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/cookies", changeFrequency: "daily", priority: 0.9 },
  { path: "/cakes", changeFrequency: "daily", priority: 0.9 },
  { path: "/desserts", changeFrequency: "daily", priority: 0.9 },
  { path: "/corporate", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/allergens", changeFrequency: "monthly", priority: 0.4 },
  { path: "/policies", changeFrequency: "monthly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts().catch(() => []);

  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.slug)
    .map((product) => ({
      url: `${SITE_URL}${getProductUrl(product)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...productEntries];
}
