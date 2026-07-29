import type { Metadata } from "next";
import { CookieBuilderContent } from "./CookieBuilderContent";

export const metadata: Metadata = {
  title: "Build Your Cookie Box | Bliss-B Desserts",
  description: "Mix and match your favorite cookie flavors into one custom box, handcrafted in Braselton, GA.",
};

export default function CookieBuilderPage() {
  return <CookieBuilderContent />;
}
