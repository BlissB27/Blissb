import Link from "next/link";
import { Lock } from "lucide-react";
import { BrandLogo } from "../BrandLogo";

// Minimal top bar for the distraction-free checkout flow (/checkout, /order-success).
// No nav, no search, no cart icon — nothing to click away to except home.
export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-border/50">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          <BrandLogo
            variant="main"
            width={220}
            height={140}
            alt="Bliss-B Desserts"
            className="h-12 w-auto"
            style={{ width: "auto" }}
            priority
          />
        </Link>
        <div className="flex items-center gap-1.5 text-sm text-brand-muted">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>Secure checkout</span>
        </div>
      </div>
    </header>
  );
}
