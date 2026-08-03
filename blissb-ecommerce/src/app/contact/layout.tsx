import type { Metadata } from "next";

// page.tsx is a client component ("use client", for the framer-motion
// reveals), so the metadata export has to live here in the segment's layout —
// a client component can't export `metadata` itself.
export const metadata: Metadata = {
  title: "Contact Us | Bliss-B Desserts",
  description: "Get in touch with Bliss-B Desserts in Braselton, GA — hours, ordering schedule, and how to reach us.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
