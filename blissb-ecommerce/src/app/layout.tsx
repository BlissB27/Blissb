import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blissbbakery.com";
const SITE_TITLE = "Bliss-B Desserts | Braselton, GA Bakery";
const SITE_DESCRIPTION =
  "Small-batch cookies, cakes, and desserts handcrafted in Braselton, GA. Order online for pickup, local delivery, or nationwide shipping.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Plain string, not a title.template — every page in this app already sets
  // its own full "X | Bliss-B Desserts" title, so a template would double the suffix.
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Bliss-B Desserts",
    images: [{ url: "/img/og-image.jpg", width: 1200, height: 633, alt: "Bliss-B Desserts — a spread of handcrafted cookies" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/img/og-image.jpg"],
  },
};

// Sets <meta name="theme-color"> — the mobile browser UI color on the site.
export const viewport: Viewport = {
  themeColor: "#9B562C",
};

// LocalBusiness/Bakery structured data — lets Google show hours, address, and
// phone directly in search results and ties the site to the Business Profile.
const BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Bliss-B Desserts",
  url: SITE_URL,
  image: `${SITE_URL}/img/cookies-hero.png`,
  telephone: "+1-470-883-5035",
  address: {
    "@type": "PostalAddress",
    streetAddress: "111 Manor Way",
    addressLocality: "Braselton",
    addressRegion: "GA",
    postalCode: "30517",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "18:00" },
  ],
  sameAs: ["https://instagram.com/blissb.bakery", "https://tiktok.com/@blissb.bakery"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className={`${bricolageGrotesque.variable} ${inter.variable} min-h-screen bg-brand-bg text-brand-text font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_JSON_LD) }}
        />
        <MotionConfig reducedMotion="user">
          <SiteChrome>{children}</SiteChrome>
        </MotionConfig>
      </body>
    </html>
  );
}
