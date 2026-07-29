---
target: category listing pages (cakes/cookies/desserts)
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-07-28T22-15-39Z
slug: blissb-ecommerce-src-app-cakes-page-tsx
---
Method: dual-agent (A: a6de73bd5e84b703e · B: af4e3055cdffc05af)
Note: Browser visualization skipped for both assessments (user policy disallows dev-server/browser automation). Source-only design review + CLI-detector-only evidence.
Scope: representative surface for all three category listing routes — `cakes/page.tsx`, `cookies/page.tsx`, `desserts/page.tsx` (near-identical templates, ~97-99 lines each) plus `ProductCard.tsx`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No loading skeleton for the server-side fetch; "in cart" badge is dead code (never renders) |
| 2 | Match System / Real World | 3 | `cookies/page.tsx` uses a `CalendarClock` icon (a clock) for the cookies hero — metaphor break |
| 3 | User Control and Freedom | 2 | No sort/filter/undo; quantity stepper has no visible cap |
| 4 | Consistency and Standards | 2 | 3 copy-pasted page files with divergent grid columns (3 vs 4 col); 4 different cream hex values + 1 unbadged green on one page |
| 5 | Error Prevention | 2 | Good component-level flavor-sum validation, but page-level fetch failures aren't prevented from misrepresenting as empty inventory |
| 6 | Recognition Rather Than Recall | 3 | FlavorSelector running total aids this well |
| 7 | Flexibility and Efficiency | 1 | No sort, filter, bulk/quick-add, or category-scoped search |
| 8 | Aesthetic and Minimalist Design | 3 | Clean but generic; loses a point to redundant info-band copy |
| 9 | Error Recovery | 1 | Fetch failure and true-empty-category are visually identical; no retry affordance; error only in server console |
| 10 | Help and Documentation | 2 | Advance-notice rule surfaced, but no link to full delivery/pickup policy at the point of browsing |
| **Total** | | **21/40** | **Acceptable (53%)** |

## Design Specificity Verdict

**LLM assessment**: Generic e-commerce category-grid template with a bakery paint job. The structural pattern (centered icon+H1, blurb, responsive card grid, count, 3-column info band) is duplicated near-verbatim across all three category routes with only icon/heading/blurb swapped — evidence of build-by-duplication rather than a parameterized template. No merchandising judgment (no featured/best-seller callout), no reference anywhere to the brand's actual differentiators (Top 5 Georgia / Top 20 nationally awards per PRODUCT.md), no seasonal or craft narrative.

**Deterministic scan**: `detect.mjs` ran clean (0 findings) across `cakes/page.tsx`, `cookies/page.tsx`, `desserts/page.tsx`, `ProductCard.tsx`. No false positives to reconcile. As with the homepage, the detector's HTML/CSS rules don't catch cross-file template duplication, color-token drift, or the error/empty-state conflation — those required reading multiple files and tracing data flow.

**Visual overlays**: Not attempted — user policy disallows dev server/browser automation for this project.

## Overall Impression

The one piece of real craftsmanship here — `FlavorSelector.tsx`'s exact-sum flavor validation with a live running total — is buried inside three pages that are otherwise a stock catalog-grid template, duplicated by copy-paste rather than shared, with a page-level bug (fetch errors indistinguishable from empty inventory) that can silently misinform customers during any backend hiccup.

## What's Working

- `FlavorSelector.tsx`'s exact-sum constraint validation with live running total is genuinely well-engineered, better craftsmanship than the surrounding page.
- `Header.tsx`'s active-tab nav state gives clear "you are here" feedback across the three category pages.
- The empty-state pattern (icon-in-circle + heading + message) is a decent, on-brand visual idea — undermined only by being reused for a case (fetch error) it wasn't designed for.

## Priority Issues

- **[P0] Fetch failure is indistinguishable from legitimate empty inventory** — `services/products.ts` and each category `page.tsx` both swallow fetch errors into `[]`; the customer sees "We're currently updating our cake selection" whether Strapi is genuinely down or the category is genuinely empty, with no retry path and the real error only logged server-side. **Why it matters**: during any backend hiccup this silently misleads paying customers about why nothing's for sale. **Fix**: distinguish "fetch failed" from "empty result" and surface an honest, retryable error state. **Suggested command**: `/impeccable audit`

- **[P1] Add-to-cart overlay button is keyboard-inaccessible and semantically invalid** — `ProductCard.tsx`'s hover-reveal overlay button (`opacity-0 group-hover:opacity-100`) has no `focus-visible` equivalent, and is a `<button>` nested inside the full-card `<Link>` anchor — invalid HTML, unreliable for assistive tech. **Why it matters**: a keyboard-only shopper can Tab to a control that never becomes visible. **Fix**: add a focus-visible/group-focus-within reveal, and restructure so the button isn't nested inside the anchor. **Suggested command**: `/impeccable audit`

- **[P1] Dead "in cart" confirmation badge (same bug as homepage)** — `ProductCard.tsx`'s `isMounted` state is never set `true`, so the on-card "in cart" badge can never render, meaning category browsing gives zero on-page confirmation that add-to-cart worked. **Suggested command**: `/impeccable audit`

- **[P2] Three copy-pasted page templates with unexplained divergence** — `cakes`/`desserts` cap the grid at 3 columns, `cookies` goes to 4; `cookies/page.tsx` ships leftover `console.log` debug statements to production. **Why it matters**: any future fix (spacing, states, a11y) has to be hand-applied three times and will drift again. **Fix**: extract one parameterized `CategoryPage` component. **Suggested command**: `/impeccable distill`

- **[P2] No unique page metadata** — all three category routes inherit the root `<title>Blisb Bakery store</title>` (note: "Blisb," a third brand-name spelling variant already flagged sitewide) and identical description. **Why it matters**: hurts SEO differentiation between category pages for a business likely dependent on organic search. **Suggested command**: `/impeccable harden`

- **[P3] Unbalanced grid at low product counts** — with the current fallback catalog (2 cakes, 2 desserts), a 3-column grid leaves a visibly empty trailing cell, reading as sparse rather than curated. **Suggested command**: `/impeccable layout`

## Persona Red Flags

**Jordan (time-pressured, wants fast add-to-cart)**: blocked by the hover-only reveal of the overlay Add-to-cart button on desktop, and by mandatory flavor-sum configuration before the button even enables for cakes — slows the "grab and go" flow this persona wants.

**Riley (first-time visitor sizing up trust)**: sees a generic template — restated boilerplate copy, a cookies page whose hero icon is a clock, `bg-white` instead of the brand's own cream — with no visible trace of the Top-5-Georgia/Top-20-national credibility signals PRODUCT.md flags as the actual differentiators. Undermines trust exactly when it matters.

**Casey (keyboard/assistive-tech user)**: hits both accessibility bugs at once — the overlay button that's focusable-but-invisible, and the permanently-broken "in cart" badge — meaning this persona gets zero feedback that add-to-cart succeeded from the grid.

## Minor Observations

- `cookies/page.tsx` ships leftover `console.log` debug statements in production.
- Info-band copy duplicates the header blurb on all three pages (e.g. "minimum 4 cookies" stated twice on the cookies page).
- `product.originalPrice` strikethrough uses off-palette Tailwind `text-gray-400` rather than a brand token — the only price-related text breaking from the brown/cream system.
- Badge colors (`bg-[#1E7A31]` "New flavor"/"Seasonal") introduce a fourth un-tokenized color sitewide via cards on every category page.
- `getProductsByCategory` fetches the entire catalog on every category page load and filters client-side rather than server-side — not a design issue per se, but it's the root cause enabling the error/empty conflation above.

## Questions to Consider

1. If the brand's real competitive edge is the Top-5-Georgia / Top-20-national recognition, why does the page a shopper lands on to actually buy never mention it?
2. Is a hover-reveal add-to-cart button worth keeping at all, given it's invisible to keyboard users and redundant with the mobile full-width button just below it?
3. Given three files are already ~95% identical, what's the argument against a single parameterized `CategoryPage` component versus hand-syncing three copies every time a fix needs to land?
