---
target: policies page
total_score: 16
max_score: 32
na_heuristics: 7,9
p0_count: 2
p1_count: 2
timestamp: 2026-07-28T22-58-36Z
slug: blissb-ecommerce-src-app-policies-page-tsx
---
Method: dual-agent (A: a2e4121c11ff30322 · B: a6ab2532bf3539ed8)
Note: Browser visualization skipped for both assessments (user policy disallows dev-server/browser automation). Source-only design review + CLI-detector-only evidence.
Scope: `blissb-ecommerce/src/app/policies/page.tsx`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Static content; scroll-triggered animation is the only "status" feedback |
| 2 | Match System / Real World | 1 | Generic e-commerce legal voice, not artisanal-bakery voice |
| 3 | User Control and Freedom | 2 | No TOC/jump-links to escape to a specific section |
| 4 | Consistency and Standards | 2 | "Bliss-B Bakery" vs. official "Bliss-B Desserts" naming; inconsistent bold-lead-in pattern within bullets |
| 5 | Error Prevention | 1 | Omits the exact facts (cutoff time, radius, minimum) that would let a customer self-check eligibility before an order attempt fails at checkout |
| 6 | Recognition Rather Than Recall | 2 | Info that should be recognizable here (schedule/radius/minimum) isn't present at all |
| 7 | Flexibility and Efficiency | n/a | Read-mode static page; no power-user path applicable |
| 8 | Aesthetic and Minimalist Design | 3 | Clean card layout, restrained color use, decent whitespace |
| 9 | Error Recovery | n/a | No interactive error states on this page |
| 10 | Help and Documentation | 3 | Contact card with phone+email is a solid affordance; undercut by the missing allergen link elsewhere |
| **Total** | | **16/32** | **Acceptable (50%)** |

## Design Specificity Verdict

**LLM assessment**: Generic boilerplate, not bakery-authored. Cross-checked every operating fact from PRODUCT.md against this page: the 2pm order cutoff, same-day delivery/pickup windows, Monday-shipping-only rule, Saturday farmers-market-only pickup, 25-mile delivery radius, and $20 minimum order are **all absent**. Instead the copy is generic dropship/e-commerce legalese ("not liable for any delays," "additional charges will apply for re-shipment," "does not account for unforeseen weather disruptions"). The real schedule/radius logic does exist correctly elsewhere in the codebase (`deliveryStore.ts`, `DeliverySelector.tsx`, `api/checkout/route.ts`) but is never surfaced on the one page whose stated purpose is "everything you need to know about ordering, shipping, and picking up."

**Deterministic scan**: `detect.mjs` ran clean (0 findings). The real issues here — missing operational facts, a genuinely broken link ecosystem — require cross-referencing multiple files and PRODUCT.md, outside the detector's scope.

**Visual overlays**: Not attempted — user policy disallows dev server/browser automation.

## Overall Impression

This page confirms, with hard evidence, the project's already-known "fix broken allergen link" to-do: `product/[productId]/page.tsx` links to `/allergens`, a route that doesn't exist anywhere in the app, and both `checkout/page.tsx` and `order-success/page.tsx` reference "our allergens info page" as plain unlinked text pointing at nothing. The policies page — the natural home for that content — has no allergen section at all. Combined with the complete absence of the real delivery/pickup schedule rules, this Read-mode surface currently fails at its one job: telling a visitor what they actually need to know before they order.

## What's Working

- Clean semantic heading hierarchy (h1 → h2 per card) and brand color tokens consistent with the rest of the site — notably, this page does NOT contribute to the sitewide color-drift problem found elsewhere.
- The closing Contact card is a genuinely warm, well-placed reassurance affordance with working `tel:`/`mailto:` links.

## Priority Issues

- **[P0] Operationally load-bearing facts are entirely missing** — no 2pm cutoff, no delivery windows, no Saturday farmers-market pickup exception, no 25-mile delivery radius, no $20 minimum, and no Delivery section at all despite delivery being a core fulfillment path. **Why it matters**: a visitor reading this page to plan an order gets an incomplete or misleading picture (e.g., assumes pickup is always at the Braselton address, unaware Saturday pickup is market-only). **Fix**: this is direct scope for the Fase 2 order-confirmation/schedule work — the policies page should be updated in lockstep with it. **Suggested command**: `/impeccable clarify`

- **[P0] Broken allergen-info ecosystem, confirmed with a real dead link** — `product/[productId]/page.tsx` links to `/allergens`, a route that does not exist anywhere under `src/app` (confirmed by glob). `checkout/page.tsx` and `order-success/page.tsx` both reference "our allergens info page" with no link at all. The policies page has zero allergen section. **Why it matters**: every path an allergy-concerned visitor could take leads nowhere — this is a food-safety trust issue, not cosmetic. **Fix**: build an `/allergens` page (or an allergen section on this policies page) and point all three existing references at it. **Suggested command**: `/impeccable harden` — this matches the project's already-known "fix broken allergen link" to-do.

- **[P1] Generic legal-boilerplate voice contradicts brand positioning** — copy reads like stock carrier/dropship disclaimer language, not an artisanal small-batch bakery speaking to its customers. **Suggested command**: `/impeccable clarify`

- **[P1] No "what if it arrives damaged/wrong" guidance** — combined with "all sales final" and no shipping-liability coverage, a customer has no stated recourse for the single most anxiety-inducing scenario a perishable-goods policy page should address. **Suggested command**: `/impeccable clarify`

- **[P2] List semantics not used; icons not marked decorative** — bullets are `<div><span>•</span><p>` instead of `<ul>/<li>`, and icon circles lack `aria-hidden`, degrading screen-reader traversal on a text-heavy page. **Suggested command**: `/impeccable audit`

## Persona Red Flags

**Jordan (first-timer, allergy concern)**: comes to this page hoping for allergen detail (it's the site's designated "everything you need to know" page) and finds none — then, if they arrived via the product page's allergen link instead, hits a 404. A double failure point for the exact anxiety this persona has.

**Sam (accessibility-dependent, dense text)**: no list semantics for bullet content, no `prefers-reduced-motion` handling on six separate animated blocks, decorative icons not hidden from assistive tech — all compound on the one page where AT efficiency matters most.

## Minor Observations

- Email casing is inconsistent (`blissBdesserts@gmail.com` vs. `blissbdesserts@gmail.com`) — a small instance of the same brand-inconsistency problem already flagged for the business name.
- Footer shows a stale `© 2025 Bliss-B Bakery` copyright year against the current 2026 date.
- "Bliss-B Bakery" is used throughout this page vs. the official "Bliss-B Desserts" naming — consistent with the already-logged sitewide naming inconsistency, but worth noting this page is part of that surface.
- The `X` icon on the Refund/Return card sits oddly next to a heading that also covers "Exchange."

## Questions to Consider

1. If the actual schedule/radius/minimum logic already lives correctly in `deliveryStore.ts` and `DeliverySelector.tsx`, why does the one page whose entire job is explaining that logic to a visitor say nothing about it — was this page ever updated after the delivery system was built?
2. Three separate pages tell the customer to "visit our allergens info page" — was `/allergens` ever built and later removed, or written aspirationally before the page existed? Given it touches food-safety trust, should this be treated as a launch-blocker rather than a backlog item?
3. Given the perishable, gift-oriented, all-sales-final policy, is the complete silence on "damaged on arrival" recourse a deliberate business decision or an oversight?
