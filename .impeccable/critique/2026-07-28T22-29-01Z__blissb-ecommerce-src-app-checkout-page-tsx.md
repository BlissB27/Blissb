---
target: checkout flow (checkout -> order-confirmation -> order-success)
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-07-28T22-29-01Z
slug: blissb-ecommerce-src-app-checkout-page-tsx
---
Method: dual-agent (A: a6685568aeca986f5 · B: a22ef9cb6e0047473)
Note: Browser visualization skipped for both assessments (user policy disallows dev-server/browser automation). Source-only design review + CLI-detector-only evidence.
Scope: full checkout flow — `checkout/page.tsx` → `order-confirmation/page.tsx` → `order-success/page.tsx`, plus `api/checkout/route.ts`, `cartStore.ts`, `deliveryStore.ts` for data flow.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Processing spinner exists, but no post-cancel status and no step indicator |
| 2 | Match System / Real World | 2 | The schedule shown (Mon/Fri delivery, Tue/Thu/Sun pickup) does not match the bakery's real documented hours at all |
| 3 | User Control and Freedom | 3 | Back-link exists; cancel-from-Stripe returns to checkout, not stranded |
| 4 | Consistency and Standards | 2 | Hardcoded hex colors diverge from `--brand-*` tokens; checkout's own cream doesn't even match the token's value |
| 5 | Error Prevention | 2 | No numeric ZIP format check, no reentrancy guard on submit, specific backend errors discarded |
| 6 | Recognition Rather Than Recall | 3 | Order summary repeated on both pages |
| 7 | Flexibility and Efficiency | 3 | Nothing power-user-specific, nothing punishing either |
| 8 | Aesthetic and Minimalist Design | 3 | Visually calm, uncluttered, no dark patterns |
| 9 | Error Recovery | 1 | Weakest score in the flow: generic top-of-form validation only, specific server errors swallowed, zero cancel/decline recovery messaging |
| 10 | Help and Documentation | 2 | Allergy notice and pickup-ID reminder are nice touches, but no visible delivery-radius/schedule policy link |
| **Total** | | **23/40** | **Acceptable (58%)** |

## Design Specificity Verdict

**LLM assessment**: Mixed — real domain logic exists server-side (flavor-split validation, per-product Strapi price/stock re-validation, a real $20 minimum gate), which is genuinely bakery-specific and honors the "never trust client-submitted prices" principle. But the customer-facing delivery/schedule surface does not match the bakery's real operating hours at all: code shows delivery only Monday/Friday and pickup only Tuesday/Thursday/Sunday with flat time slots, while PRODUCT.md documents Tue-Fri with a 2pm cutoff (same-day 2-6pm delivery or 6-8pm pickup), Monday as shipping-only, and Saturday as pickup-only at the farmers market. This is expected as pre-Fase-2 state, but concretely, the app currently shows a schedule that actively contradicts reality rather than merely being unfinished. Additionally, delivery copy promises a "25-mile radius" that nothing in the code actually enforces — only a hardcoded ZIP allow-list decides free-vs-fee, never eligibility, so an out-of-state address can complete a paid delivery order today.

**Deterministic scan**: `detect.mjs` found 1 raw finding (`border-accent-on-rounded` in `order-success/page.tsx:220`), confirmed by Assessment B as a **false positive** — a standard `animate-spin` loading spinner, not a decorative border. `checkout/page.tsx` and `order-confirmation/page.tsx` scanned clean. Net genuine findings: 0.

**Visual overlays**: Not attempted — user policy disallows dev server/browser automation.

## Overall Impression

This is the highest-stakes surface on the site — real money, real trust — and it's held together well on the "happy path" (server-side validation is genuinely defensive, the $20 minimum is surfaced early, the success page is the most emotionally crafted moment on the whole site). But the unhappy paths are the weakest link: a refreshed tab, a declined card, or a rejected order all currently lead to silence or a generic dead-end message rather than the clarity Product Principle 3 explicitly demands.

## What's Working

- Server-side re-validation of price/stock/flavor-splits in `api/checkout/route.ts` is genuinely defensive — client-submitted values are never trusted, matching the stated product principle.
- The $20 minimum is surfaced early (cart drawer) and consistently reiterated, never sprung as a last-step surprise.
- `order-success/page.tsx`'s emotional pacing (staggered animations, order number, "what's next" cards, allergy notice) is the most crafted, least-templated moment in the entire flow.

## Priority Issues

- **[P0] Refreshing `/checkout` can silently eject the customer mid-flow** — `checkout/page.tsx` runs its "redirect if cart empty" check in a `useEffect` on mount with no hydration guard, while `order-confirmation/page.tsx` explicitly works around this exact zustand-persist rehydration race elsewhere in the codebase (a 500ms hydration delay, with a code comment admitting the fix) — proving the team already hit and fixed this bug once, just not here. **Why it matters**: a customer who refreshes or reopens `/checkout` (accidental F5, phone lock/unlock) can be read as having an empty cart before rehydration completes and get bounced to the homepage, losing their place in a real-money flow. **Fix**: apply the same hydration guard already used on order-confirmation. **Suggested command**: `/impeccable audit`

- **[P1] Backend validation errors are discarded and replaced with a generic message** — `checkout/page.tsx` never checks `response.ok` on the `/api/checkout` fetch; when the server rejects an order with a specific, already-computed reason (unavailable stock, invalid flavor split, price mismatch), the client falls through to a failed redirect and shows only "Something went wrong. Please try again." **Fix**: surface the server's actual error message. **Suggested command**: `/impeccable clarify`

- **[P1] No messaging when payment is canceled/declined and the customer returns to checkout** — Stripe's `cancel_url` sends a canceled session straight back to a bare checkout form with zero acknowledgment that anything happened. **Why it matters**: this is precisely the ambiguity Product Principle 3 exists to prevent — the customer won't know if they were charged or should retry. **Fix**: read the cancel state and show an explicit "payment wasn't completed, nothing was charged" banner. **Suggested command**: `/impeccable clarify`

- **[P2] Delivery-radius promise isn't enforced; only a ZIP allow-list decides fee, not eligibility** — copy advertises "delivery within 25 miles," but the code only checks a hardcoded ZIP list to decide free-vs-$20-fee, never rejecting an out-of-radius address. **Why it matters**: a customer in another state can pay for delivery that isn't actually possible, discovering the mismatch only after payment via a manual follow-up. Expected as pre-Fase-2 state, but worth flagging as concretely misleading today. **Suggested command**: this is direct scope for the planned Fase 2 Google Maps mileage-based delivery pricing work.

- **[P2] `sessionStorage` success-gate can be satisfied by a stale, unrelated session** — the `payment_in_progress` flag is set before every Stripe redirect but only cleared on an immediate client error or a successful landing on `/order-success`; if a customer cancels from Stripe and later revisits `/order-success` with any session id, the stale flag can trigger the full "Order Confirmed!" UI and cart-clear regardless of whether that payment actually succeeded. Mitigated in practice by the webhook being the real source of truth for inventory/email, but the customer-facing "confirmed" state itself isn't reliably gated on an actual successful payment. **Suggested command**: `/impeccable audit`

- **[P3] Route naming/copy mismatch: "Order Confirmation" page confirms nothing** — the page's own `<h1>Order Confirmation</h1>` sits next to subtext "Please review your order before proceeding to checkout" — self-contradictory, and primes the wrong mental model before the customer even reaches payment. Presumably exactly what the planned Fase 2 redesign addresses. **Suggested command**: this is direct scope for the planned Fase 2 order-confirmation redesign.

## Persona Red Flags

**Jordan (first-timer, worried about payment)**: Hits the cancel-path gap hardest — if they get cold feet on Stripe's page and back out, they land on a silent, blank-feeling checkout form with no "nothing was charged" reassurance. Also exposed to an unexplained "Fees" line item right before committing to pay.

**Riley (stress-tests edge cases)**: Finds that the schedule shown doesn't match the bakery's real hours, and that entering an out-of-area ZIP for delivery is silently accepted with a flat fee rather than rejected — exactly the "ordering outside the 25-mile radius" scenario that fails today.

**Casey (mobile)**: Layout itself collapses correctly to single-column on mobile, but the top-of-form-only error summary (no per-field inline errors) is worse here, since the error list and the field needing correction end up further apart on a scrolling single column.

## Minor Observations

- `handleSubmit` has no `if (isProcessing) return;` reentrancy guard at the top — relies entirely on disabled-button re-render timing to prevent double submission.
- ZIP validation only checks `.length === 5`, not numeric format — `"abcde"` would pass client-side.
- `deliveryStore.ts` mutates a module-level "constant" config object directly outside of `set()` — a state-management smell that could cause stale-closure bugs later.
- `TimeSlot` type includes `maxOrders`/`currentOrders` fields that are never populated or used anywhere — dead fields suggesting an abandoned capacity-limiting feature, worth revisiting given real small-batch production capacity constraints.
- The "Secured by 256-bit SSL encryption" trust line reads like a stock copy-pasted checkout template line, disconnected from the brand voice.
- One total (`deliveryFee` on order-confirmation) renders without `.toFixed(2)` while every other total in the app uses it — could show `$20` vs `$20.00` inconsistently.

## Questions to Consider

1. If the real source of truth for "did this order really happen" is the Stripe webhook, why does the customer-facing success state depend on client-side `sessionStorage` flags rather than a lightweight server check of the session's payment status before declaring "Order Confirmed"?
2. Given Fase 2 is an explicit planned redesign of the schedule/confirmation UX, is it worth disclaiming or simplifying the current wrong-hours calendar in the interim, rather than shipping it as-is until the rewrite lands?
3. Is there a business reason not to label the checkout "Fees" line plainly (e.g., "Card processing fee (2.9% + $0.80)"), given this is exactly the kind of unexplained charge that erodes trust at a premium small-batch price point?
