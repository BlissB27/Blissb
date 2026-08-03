import type { Metadata } from "next";

// page.tsx is a client component, so the metadata export has to live here.
// Transactional page — no reason for search engines to index it.
export const metadata: Metadata = {
  title: "Your Cart | Bliss-B Desserts",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
