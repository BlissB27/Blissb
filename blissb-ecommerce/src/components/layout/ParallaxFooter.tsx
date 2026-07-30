"use client";

import { useEffect, useRef, useState } from "react";
import { Footer } from "./Footer";

/**
 * Footer is pinned (fixed) to the viewport bottom, behind the page content
 * (lower z-index). A spacer sized to the footer's real height is added after
 * the content so there's genuine scroll room past the last section — only
 * then does the transparent gap slide up over the pinned footer and reveal it.
 */
export function ParallaxFooter({ children }: { children: React.ReactNode }) {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setFooterHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="relative z-10 bg-brand-bg">{children}</div>

      <div ref={footerRef} className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>

      <div style={{ height: footerHeight }} aria-hidden="true" />
    </>
  );
}
