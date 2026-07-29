"use client";

import { CookieBoxBuilder } from "@/components/CookieBoxBuilder";

export function CookieBuilderContent() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16">
        <CookieBoxBuilder />
      </div>
    </div>
  );
}
