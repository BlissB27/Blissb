import type { Metadata } from "next";

// page.tsx is a client component, so the metadata export has to live here in
// the segment's layout — a client component can't export `metadata` itself.
export const metadata: Metadata = {
  title: "Policies | Bliss-B Desserts",
  description: "Ordering schedule, delivery, pickup, shipping, refunds, and cancellation policies for Bliss-B Desserts in Braselton, GA.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
