---
target: /checkout page (src/app/checkout/page.tsx)
total_score: 31
p0_count: 1
p1_count: 2
timestamp: 2026-08-01T03-49-59Z
slug: src-app-checkout-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading/processing spinners are good, but a failed PaymentIntent creation leaves Step 3 rendered "active" with nothing in it — no spinner, no form, no message at the point of failure. |
| 2 | Match System / Real World | 4 | Honest, plain-language copy throughout ("Card processing fee (2.9% + $0.80)", real delivery windows). |
| 3 | User Control and Freedom | 3 | "Edit" links work, but editing Step 1 or Step 2 after reaching Payment forces re-confirming every step after it, even if nothing changed. |
| 4 | Consistency and Standards | 4 | Shadcn components, brand tokens, and the stepper pattern are used consistently; the earlier double-padding bug is fixed. |
| 5 | Error Prevention | 2 | Contact fields (name/email/phone) have no inline format validation — errors only surface after clicking Continue, as an aggregated list. |
| 6 | Recognition Rather Than Recall | 3 | Strong on desktop (summary always visible); weak on mobile, where Order Summary sits below all 3 steps. |
| 7 | Flexibility and Efficiency | 3 | Native input types (`email`, `tel`) enable browser autofill; no other accelerators, which is appropriate for a checkout. |
| 8 | Aesthetic and Minimalist Design | 4 | Distraction-free header, single accent color, no clutter — this is the flow's strongest area. |
| 9 | Error Recovery | 2 | The exact bug already surfaced in testing: a checkout failure (e.g. out-of-stock item) advances to Step 3 but shows no form and no actionable message near the failure point — the only feedback is a banner at the very top of a possibly-scrolled page. |
| 10 | Help and Documentation | 3 | No general help, but the allergen-info link is a nice, contextual touch exactly where it's needed. |
| **Total** | | **31/40** | **Good** |

## Anti-Patterns Verdict

**LLM assessment**: This doesn't read as AI-generated — it uses the site's own brand tokens (Kitchen Brown, warm paper background), a real signature stepper component instead of a generic Tabs pattern (already deliberately rejected earlier), and honest copy. No gradient text, no side-stripe borders, no fake urgency.

**Deterministic scan**: `detect.mjs` ran against `checkout/page.tsx`, `DeliverySelector.tsx`, and `CheckoutHeader.tsx` — clean, zero findings.

**Visual overlays**: Not available this run — no browser automation tool is enabled in this session (consistent with your earlier instruction not to use it), so I read the rendered logic directly from source instead of a live screenshot. Flagging this rather than claiming a browser check happened.

## Overall Impression

The structure is solid — vertical stepper, brand-consistent styling, honest pricing shown at every point. The real problem isn't visual polish, it's what happens when something goes wrong: the flow has no graceful failure path. That's exactly the bug your screenshot caught (the "unavailable item" error), and it's systemic, not a one-off — any `/api/checkout` failure produces the same dead-end.

## What's Working

- **The stepper itself.** Numbered circles, one-line summaries on completed steps, "Edit" to reopen — this is the standard, non-Tabs pattern you asked for, executed cleanly.
- **Price integrity.** Once the server returns a real breakdown, the UI adopts it instead of trusting the client estimate — total never drifts from what's actually charged.
- **Restraint.** One accent color, no clutter, the allergen notice is placed exactly where a customer would want it (right before paying), not buried in a policy page.

## Priority Issues

**[P0] Checkout failures leave Step 3 in a dead-end, empty state**
- **Why it matters**: `confirmDeliveryStep` calls `setCurrentStep(3)` optimistically, *before* the `/api/checkout` request resolves. If that request fails (bad address, out-of-stock item, coupon rejected, anything), the step still advances — but `clientSecret` stays `null`, so Step 3 renders as "active" with nothing in it beyond two icons and a "Secure checkout" line. The only feedback is a red banner all the way at the top of the page, disconnected from where the user is looking. This is precisely the state your screenshot showed.
- **Fix**: Don't advance to Step 3 until the PaymentIntent request succeeds. On failure, stay on Step 2 and show the error right there (near the Continue button), so the fix is exactly where the failure happened.
- **Suggested command**: `/impeccable harden`

**[P1] Editing an earlier step re-triggers every step after it, even unchanged**
- **Why it matters**: `confirmContactStep` always sends the user to Step 2, and `confirmDeliveryStep` always re-POSTs to `/api/checkout` and creates a brand-new PaymentIntent — even if the user only fixed a typo in their email and delivery info never changed. That's an unnecessary network round-trip, a new orphaned PaymentIntent on Stripe's side, and forces the user to click "Continue" again on a step they'd already completed.
- **Fix**: Track which steps are genuinely dirty; skip re-confirmation (and re-creating the PaymentIntent) for steps that haven't changed since they were last confirmed.
- **Suggested command**: `/impeccable harden`

**[P1] On mobile, pricing is invisible until the user scrolls past the entire form**
- **Why it matters**: The two-pane desktop layout (steps left, summary right) stacks vertically below `lg:`, and the Order Summary `<div>` is the second child in the DOM — so a phone user fills out contact info, delivery, and reaches payment without ever seeing the total unless they scroll all the way down first. This is the classic mobile-checkout gap; Shopify and most modern checkouts solve it with a sticky/collapsible summary bar.
- **Fix**: Add a collapsible "Order summary — $X total" bar pinned near the top on mobile only (`lg:hidden`), expandable to the full item list.
- **Suggested command**: `/impeccable adapt`

**[P2] Form errors are aggregated in a banner instead of shown at the field**
- **Why it matters**: `validationErrors` (e.g. "Email is required") renders as a bulleted list in a card above the stepper, not next to the actual `Input`. A user has to visually map "Email is required" back to which field is empty instead of seeing it inline.
- **Fix**: Pass per-field error state into each `Input` (shadcn's `aria-invalid` styling is already wired up in `input.tsx` — it's just not being used) and show the message directly under the relevant field.
- **Suggested command**: `/impeccable clarify`

**[P3] Decorative icons in the Payment step header have no label**
- **Why it matters**: The `CreditCard` + `Lock` icon row above the Payment Element carries no text and no `aria-hidden`, so it's ambiguous for sighted first-time users and noisy for screen readers.
- **Fix**: Either add a short label ("Pay securely") or mark both icons `aria-hidden="true"` since the line below already has the text version ("Secure checkout powered by Stripe").
- **Suggested command**: `/impeccable clarify`

## Persona Red Flags

**Riley (Stress Tester)**: This persona already found the P0 above in production — an out-of-stock item ("Monster") triggered exactly the dead-end failure state described. Also: refreshing mid-flow or navigating back after Step 3 has already created a PaymentIntent leaves an orphaned, unused PaymentIntent on Stripe's side every time (no cleanup) — not user-visible, but worth knowing about operationally.

**Casey (Distracted Mobile User)**: Fills out Steps 1–2 one-handed, reaches Payment, and still hasn't seen a total — has to scroll back up past everything to check the price before paying. High abandonment risk right at the moment of highest intent.

**Jordan (First-Timer)**: Gets "Please fix the following: Email is required" in a banner, but has to scan three fields to find the empty one. Also unsure what the credit-card-and-lock icon pair above the payment form means since neither is labeled.

## Minor Observations

- Order Summary item thumbnails use a plain `<img>`, not `next/image` — fine for a handful of small icons, but worth a look if this page's LCP/CLS is ever profiled (`/impeccable optimize`).
- Semantic status colors (yellow banner for min-order, red for errors) intentionally sit outside the brand palette — correct convention, just noting it's a deliberate exception to the One Brown Rule, not a miss.
- Contrast was checked, not assumed: brand-muted-on-paper (~6.1:1), brand-brown-on-paper (~5.4:1), and the muted badge text (~4.65:1) all clear WCAG AA.

## Questions to Consider

- Does the Payment step actually need its own icon row, or would that space be better spent reinforcing the total ("You're paying $X") right above the button?
- If a PaymentIntent already exists and delivery info hasn't changed, could Stripe's `paymentIntents.update` replace "create a new one every time," instead of accumulating throwaway intents in the dashboard?
