---
target: homepage (blissb-ecommerce/src/app/page.tsx)
total_score: 22
max_score: 36
na_heuristics: 7
p0_count: 2
p1_count: 2
timestamp: 2026-07-28T22-05-26Z
slug: blissb-ecommerce-src-app-page-tsx
---
Method: dual-agent (A: a339c3d9a29d8dac3 · B: a194979c4b8ced388)
Note: Browser visualization was skipped for both assessments (user policy disallows dev-server/browser automation for this project). Assessment A is a source-only design review; Assessment B is CLI-detector-only. This is a documented deviation from the skill's default flow, not a silent degradation of the dual-agent requirement itself.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | `ProductCard.tsx`'s `isMounted` state is set but never updated — "in cart" confirmation badge can never render |
| 2 | Match System / Real World | 2 | FAQ claims no same-day/local delivery, contradicting PRODUCT.md's documented same-day delivery/pickup windows |
| 3 | User Control and Freedom | 3 | Tabs/carousel/accordion all reversible, no traps |
| 4 | Consistency and Standards | 1 | 4 different cream hex values, 2 different brown accents, unused `--brand-*` tokens, `<title>` reads "Blisb Bakery store" (3rd spelling variant) |
| 5 | Error Prevention | 3 | Add-to-cart correctly gated on flavor selection; quantity floors at 1 |
| 6 | Recognition Rather Than Recall | 3 | Clear tab labels, self-explanatory FAQ, visible price/name/image |
| 7 | Flexibility and Efficiency | n/a | First-visit Persuade-mode marketing surface; no power-user path applies |
| 8 | Aesthetic and Minimalist Design | 2 | 11 FAQ items shown flat at once; dense ProductCard controls exposed at browse stage |
| 9 | Error Recovery | 3 | Good empty-category state with reset link, but silent fetch-error catch makes real outages indistinguishable from "empty category" |
| 10 | Help and Documentation | 3 | FAQ is thorough but contains at least one accuracy conflict (see #2) |
| **Total** | | **22/36** | **Acceptable (61%)** |

## Design Specificity Verdict

**LLM assessment**: Mixed, leaning generic-template-with-bakery-copy-pasted-on-top. Copy layer (Hero tagline, detailed FAQ) shows real authorship, but the visual/systems layer is largely generic: default Geist/Geist Mono fonts (Next.js starter default), an unpruned shadcn/ui token scaffold in `globals.css` (chart/sidebar tokens never used), and abandoned `--brand-*` tokens that no component actually references — every component hardcodes its own hex instead. Structurally, Hero + occasion-banner + product-tabs-grid + FAQ-accordion + logo-strip-awards is the shape of a generic commerce starter. No owner/baker photo or process shot anywhere, despite PRODUCT.md's explicit ask that "small-batch/artisanal positioning should read through craft and care in the UI."

**Deterministic scan**: `detect.mjs` ran clean (0 findings) across `page.tsx`, `Hero.tsx`, `Banner.tsx`, `ProductTabs.tsx`, `Faq.tsx`, `Awards.tsx`, `ProductCard.tsx` — exit code 0. No false positives to report since there were no hits. The detector's HTML/CSS anti-pattern rules don't catch the cross-file color-token inconsistency or copy-accuracy issues Assessment A found; those require reading multiple files together, which is outside the detector's scope.

**Visual overlays**: Not attempted. Per user policy, no dev server was started and no browser automation tool was used for either assessment, so no live screenshot or in-browser overlay exists for this run.

## Overall Impression

The homepage's copy and micro-interactions (empty-state handling, Hero animation, detailed FAQ) show more care than its visual system does. The biggest opportunity is also the cheapest to fix conceptually: the site's best trust asset (competition wins) is buried last in scroll order and invisible to desktop visitors in the hero, while a corporate/event banner aimed at a secondary audience runs before any actual product appears to the primary one.

## What's Working

- `ProductTabs.tsx`'s empty-state handling (loading skeleton + "No products found... View all products" reset) is a genuinely well-designed micro-interaction.
- Hero copy and the FAQ's operational depth (freshness window, reheating instructions, allergen disclosure) carry real brand voice.
- `WaveDivider.tsx` is a small, bespoke decorative touch appropriate to a food brand, not generic.

## Priority Issues

- **[P0] White-on-tan contrast failure on the Banner "Corporate Gifts" card** — `Banner.tsx` sets `panelBg="#EFC596"` with no `panelText` override, so heading/description/button default to white text on light tan. **Why it matters**: likely fails WCAG AA contrast, making the middle Banner card effectively unreadable for many users. **Fix**: set an explicit dark `panelText` for this card, or adjust `panelBg` to a shade that passes 4.5:1 with white. **Suggested command**: `/impeccable audit`

- **[P0] FAQ contradicts the documented ordering model** — `Faq.tsx` line 18 states no same-day/local delivery is offered, directly conflicting with PRODUCT.md's same-day delivery/pickup cutoff windows. **Why it matters**: if PRODUCT.md is current, the homepage is actively misinforming customers about how to order, which could suppress same-day conversions or cause confusion at checkout. **Fix**: reconcile FAQ copy with the actual current ordering rules (this may already be covered by the Fase 2 order-confirmation/schedule redesign — verify before editing). **Suggested command**: `/impeccable clarify`

- **[P1] Dead "in cart" feedback state** — `ProductCard.tsx`'s `isMounted` is initialized but never set to `true` (no setter used), so the quantity/"in cart" confirmation badge can never render. **Why it matters**: breaks visibility-of-system-status for the primary conversion action (add to cart) on the homepage grid. **Fix**: wire the missing state update (likely a one-line bug, not a design decision). **Suggested command**: `/impeccable audit`

- **[P1] Best trust asset is buried and desktop-invisible** — Awards (Top 5 GA 2024, Top 20 national 2023) sits last in page order, and the Hero's own award badge is `md:hidden`, so desktop visitors see zero award signal until scrolling past Banner, ProductTabs, and FAQ. **Why it matters**: this is the single strongest credibility differentiator per PRODUCT.md's positioning, effectively hidden from the audience most likely to convert on trust signals. **Fix**: surface a compact award/credibility signal in or near the Hero for all breakpoints; consider promoting the full Awards section earlier in scroll order. **Suggested command**: `/impeccable layout`

- **[P2] Brand color and naming inconsistency confirmed on this page** — four different cream background hex values, two different brown accent colors (`#8F4B2B` vs `#C08552` in Faq.tsx), unused `--brand-*` tokens, and `<title>` reading "Blisb Bakery store" (a third spelling variant). **Why it matters**: this is exactly the Fase 3 problem PRODUCT.md already flags project-wide, visibly present on the flagship page itself. **Fix**: this is the intended scope of the planned Fase 3 brand-consistency pass — document current tokens, then unify. **Suggested command**: `/impeccable document`, then `/impeccable colorize`

- **[P3] IA priority inversion** — Banner (corporate/event content, the secondary audience) runs immediately after Hero, ahead of ProductTabs (the primary audience's actual products). **Why it matters**: inverts PRODUCT.md's stated audience priority (individual customers primary, corporate secondary). **Fix**: consider moving Banner below ProductTabs, or splitting it so only the consumer-relevant card(s) appear early. **Suggested command**: `/impeccable layout`

## Persona Red Flags

**Jordan (Confused First-Timer)**: The Hero's "See The Menu" CTA routes only to `/cookies`, silently excluding cakes and desserts from the very first click. Then ProductTabs' "We ship every Monday" headline and the FAQ's "we do not offer same-day/local delivery" line lead Jordan to reasonably (and likely incorrectly) conclude there's no fast/local option — a takeaway that could cause abandonment rather than an order.

**Riley (Deliberate Stress Tester)**: `ProductTabs.tsx`'s category-switch `useEffect` has no abort/stale-response guard, so rapidly switching tabs can let a slow "cookies" fetch overwrite a later "cakes" click with the wrong category's data. Riley would also immediately notice two unreconciled order-minimum rules — FAQ's "4 cookies minimum" vs PRODUCT.md's "$20 subtotal minimum" — and likely try to break checkout right at that boundary (e.g., 4 cheap cookies under $20).

**Casey (Distracted Mobile User)**: `Hero.tsx` uses `flex-col-reverse` on mobile, placing the hero image before the headline/CTA, pushing "See The Menu" further down the initial viewport for a skimming user. `ProductTabs.tsx`'s mobile carousel layers manual drag-tracking math on top of native `overflow-x-auto snap-x` scrolling — two competing touch-handling systems that risk janky double-handling on a fast swipe.

## Minor Observations

- `Hero.tsx` line 108 has a leftover dev comment (`// Asegúrate de tener esta imagen aquí`) suggesting unfinished polish.
- `Banner.tsx`'s "Catering" card links to `/corporate` rather than a dedicated catering flow, despite the FAQ describing a distinct "Catering Request Form."
- `Awards.tsx`'s second 2023 award image is mislabeled `alt="2024 Award 2"` — a copy-paste alt-text bug, on top of generally non-descriptive alt text across all four award images.
- `Faq.tsx`'s accordion toggle has no `aria-expanded`/`aria-controls`; `ProductTabs.tsx`'s filter tabs have no `role="tablist"/"tab"` — both keyboard/screen-reader gaps.
- `globals.css` ships a full unused shadcn chart/sidebar token scaffold — harmless at runtime, but signals the design system was never pruned to this project's actual needs.
- Hero's badge claims "Best of Georgia 2025," an award not listed among PRODUCT.md's confirmed "Evidence on Hand" (Top 5 GA 2024, Top 20 national 2023) — worth confirming whether this is a real third award or a stale/wrong asset before Fase 3 touches this component.

## Questions to Consider

1. If the homepage's single best differentiator is "Top 5 in Georgia / Top 20 nationally," why is that proof invisible to every desktop visitor until they've scrolled past four other sections?
2. Is "Best of Georgia 2025" a real, separate, confirmed award — and if so, why isn't it documented or referenced anywhere else on the page?
3. Given individual gift/personal-occasion buyers are the primary audience, why does the second section speak exclusively to corporate/event buyers before a single product has been shown?
