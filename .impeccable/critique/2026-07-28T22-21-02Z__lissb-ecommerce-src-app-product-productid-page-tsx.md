---
target: product detail page (product/[productId])
total_score: 19
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-07-28T22-21-02Z
slug: lissb-ecommerce-src-app-product-productid-page-tsx
---
Method: dual-agent (A: a6cf7f21b04671233 · B: aa09b72740aa3a58e)
Note: Browser visualization skipped for both assessments (user policy disallows dev-server/browser automation). Source-only design review + CLI-detector-only evidence.
Scope: `blissb-ecommerce/src/app/product/[productId]/page.tsx` (product detail page), evaluated against its current, uncommitted working-tree state — this is the Fase 1 flavor-checkbox feature the user has not yet manually verified.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Live flavor counter is good, but add-to-cart validation failures are swallowed as `console.error` only — no toast/inline message |
| 2 | Match System / Real World | 2 | Product-care copy is excellent; Lorem Ipsum literally ships when `product.description` is empty in Strapi |
| 3 | User Control and Freedom | 1 | No reset/clear-selection in FlavorSelector; changing top quantity doesn't rebalance or clear an existing flavor split |
| 4 | Consistency and Standards | 1 | Two separate UI mechanisms both claim to set "quantity" (top stepper vs. flavor-quantity sum) with no reconciliation; more color-hex drift than home/category pages |
| 5 | Error Prevention | 1 | Design permits contradictory states (top quantity ≠ flavor split sum) rather than structurally preventing them |
| 6 | Recognition Rather Than Recall | 3 | All flavors visible as checkboxes, running total shown |
| 7 | Flexibility and Efficiency | 1 | No direct numeric quantity entry anywhere — every unit requires a click, painful for larger orders |
| 8 | Aesthetic and Minimalist Design | 3 | Clean card layout; loses a point to color/hex sprawl |
| 9 | Error Recovery | 2 | Validation text exists but doesn't say over/under target, doesn't identify which row, no `aria-live` |
| 10 | Help and Documentation | 3 | Allergens link, shipping link, and product-care section provide real contextual help |
| **Total** | | **19/40** | **Poor (48%)** |

## Design Specificity Verdict

**LLM assessment**: Mixed — genuine bakery craft undermined by unshipped placeholder content. The product-care section (reheating instructions, freezing windows, category-specific copy) is authentic and correct. But `page.tsx` falls back to literal Lorem Ipsum when a product's Strapi description is empty, and other sections use generic stock copy ("Made with premium ingredients and traditional methods") one screen away from the genuinely specific care section. The page reads as bakery-authored wherever a human clearly wrote content, and generic-scaffold wherever a developer left a placeholder.

**Deterministic scan**: `detect.mjs` returned 1 raw finding — `border-accent-on-rounded` at `page.tsx:78` — but Assessment B confirmed this is a **false positive**: the flagged element is a standard `animate-spin` loading-spinner (`border-b-2` is the conventional one-sided-border spin technique), not a decorative border clashing with a rounded card. Net mechanical findings after false-positive review: 0. `FlavorSelector.tsx`, `ProductCard.tsx`, and `cartStore.ts` scanned clean.

**Visual overlays**: Not attempted — user policy disallows dev server/browser automation.

## Overall Impression

This is the most functionally complex and highest-risk surface on the site — it's also where the in-progress Fase 1 flavor-checkbox feature lives, uncommitted, awaiting manual verification. The core interaction has a real structural bug: the page renders two independent ways to set "quantity" (a top stepper, and the sum of per-flavor counts) with nothing keeping them in sync, which is exactly the kind of thing that reads fine in isolation but breaks the moment a customer changes their mind mid-configuration.

## What's Working

- FlavorSelector's intro copy dynamically states the exact target number in plain language — good constraint communication at the point of entry.
- The Radix-based `Checkbox` gives genuine keyboard/screen-reader support for free (proper role, state, built-in focus ring) — a solid accessibility foundation.
- The product-care section has authentic, specific, correct bakery instructions (350°F/180°C, 8-10 min oven, 8-10 sec microwave, freezing windows) that genuinely support the small-batch positioning.

## Priority Issues

- **[P0] Duplicate, unsynced quantity input** — For any non-box product with flavors, both the top "Quantity" stepper and the FlavorSelector's per-flavor split render simultaneously, representing the same fact (total units) with no reconciliation. Changing the top stepper after distributing flavors leaves the split stale and invalid with no auto-adjust and no guided recovery — same pattern reproduced in `ProductCard.tsx`. **Why it matters**: this is the core interaction of the in-progress Fase 1 feature and it's structurally error-prone before it's even shipped. **Fix**: consider removing the separate top quantity stepper for flavor-bearing products entirely and let the flavor split itself be the source of truth for total quantity (check first flavor → quantity becomes 1, etc.). **Suggested command**: `/impeccable audit` before this gets committed.

- **[P0] Lorem Ipsum can ship to real customers** — `page.tsx` falls back to literal placeholder Latin text whenever `product.description` is empty in Strapi. PRODUCT.md explicitly states "no placeholder/fake product data should be introduced." **Fix**: replace with an honest fallback (omit the section, or a short generic-but-real line) never literal filler text. **Suggested command**: `/impeccable harden`

- **[P1] Silent, unsurfaced add-to-cart failure path** — `cartStore.addItem` only `console.error`s on validation failure; there is no toast/inline message anywhere in `page.tsx` or `ProductCard.tsx`. The UI relies entirely on the CTA's `disabled` state as the only guard — if that guard ever has a gap (stale closure, race condition), the customer clicks "Add to cart" and nothing visibly happens. **Suggested command**: `/impeccable harden`

- **[P1] No PDP-level signal that add-to-cart isn't final confirmation** — Per PRODUCT.md's checkout-clarity principle and the checkout route's server-side re-validation, a customer can complete the full flavor-split configuration and still be rejected at checkout with no warning this was ever possible. **Suggested command**: `/impeccable clarify`

- **[P2] Checked-flavor-at-zero-quantity edge case** — Checking a flavor sets its quantity to 0 but it still counts against the 3-flavor cap, so a user can check 2 flavors, leave one at 0, and be blocked from selecting a real third flavor with no explanation. **Suggested command**: `/impeccable audit`

- **[P2] Accessibility gaps on the constraint-feedback loop** — No `aria-label` on any of the stepper `−`/`+` buttons (a screen reader hears "button, button" with no indication of which flavor or direction), and no `aria-live` on the running total/validity text — the exact-sum constraint this component exists to enforce is never communicated to screen-reader users in real time. **Suggested command**: `/impeccable audit`

- **[P3] Related product shown twice** — `relatedProducts[0]` appears both in the "Maybe you'd like to also try this" sidebar block and again in the "You may also like" grid below it. **Suggested command**: `/impeccable distill`

## Persona Red Flags

**Jordan (confused first-timer)**: Checks a flavor, sees it default to 0, doesn't realize they need to click "+" separately; doesn't understand why the top "Quantity" stepper they already set doesn't seem to matter to the flavor rows below.

**Riley (deliberate stress tester)**: Can freely click a flavor's "+" past the target with no clamp, producing e.g. "5/3 selected" with no indication of over vs. under; can also leave a checked flavor at qty 0, silently eating one of the 3 allowed slots.

**Casey (distracted mobile user)**: No sticky Add-to-Cart bar despite this being the longest, most interaction-heavy configurator on the site; must scroll back up to re-read the target quantity while distributing flavors further down the page.

## Minor Observations

- Thumbnail gallery buttons have no `aria-current`/selected-state exposed to assistive tech beyond visual border color.
- Green (`#1E7A31`) is reused for price emphasis, the "New flavor" badge, the "Seasonal" badge, and the primary CTA — four distinct meanings sharing one raw hex with zero differentiation or token.
- Custom-message input has a static "Max 50 characters" hint but no live remaining-character counter.
- The embedded `ProductCard` instances on this page (related-product previews) inherit the previously-flagged dead `isMounted` state (the "in cart" badge can never render) and the hover-reveal overlay button with no focus-visible fallback — both apply here too since this page renders that component.
- Quantity steppers (page-level and per-flavor) have no upper bound and no direct numeric entry — tedious for larger orders (e.g. a dozen cookies split three ways = ~12 individual clicks per row).
- "Shipping calculated at checkout" is positioned above the product description, interrupting the persuasive read (name → price → story) with a transactional aside before the visitor has decided they want the product.

## Questions to Consider

1. If checking a flavor and leaving it at quantity 0 is meaningless, why let it consume one of the 3 allowed flavor slots at all?
2. Why does a separate "Quantity" stepper exist for flavor-bearing products when the real, authoritative quantity is whatever the flavor split sums to — could the top stepper be removed entirely, eliminating the two-sources-of-truth problem outright?
3. Given the checkout-clarity principle, should the PDP say anything about final availability being confirmed at checkout, or is that intentionally deferred to the Fase 2 order-confirmation redesign already planned?
