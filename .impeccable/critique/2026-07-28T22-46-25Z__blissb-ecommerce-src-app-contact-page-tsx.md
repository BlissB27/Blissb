---
target: contact page
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 1
timestamp: 2026-07-28T22-46-25Z
slug: blissb-ecommerce-src-app-contact-page-tsx
---
Method: dual-agent (A: a716db29f93ae8dca · B: acdc2c96b00faa8f7)
Note: Browser visualization skipped for both assessments (user policy disallows dev-server/browser automation). Source-only design review + CLI-detector-only evidence.
Scope: `blissb-ecommerce/src/app/contact/page.tsx`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Shows a "Message Sent!" status, but it's fabricated — arguably worse than no feedback since it's confidently wrong |
| 2 | Match System / Real World | 1 | `mailto:`/`tel:` hrefs don't match their displayed email/phone labels |
| 3 | User Control and Freedom | 3 | Simple, low-risk form |
| 4 | Consistency and Standards | 2 | Three unreconciled "brand brown" hex values across contact/corporate/tokens; page background doesn't match site shell |
| 5 | Error Prevention | 2 | Only native HTML5 validation, no spam/abuse guard |
| 6 | Recognition Rather Than Recall | 3 | Good subject placeholders, FAQ pre-answers common questions |
| 7 | Flexibility and Efficiency | 2 | No order-reference field, single rigid path |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, restrained, the page's strongest dimension |
| 9 | Error Recovery | 1 | No error path exists at all — silent failure is indistinguishable from success |
| 10 | Help and Documentation | 2 | FAQ promises a "Catering Request Form" that doesn't exist as a distinct thing — it's this same broken form |
| **Total** | | **20/40** | **Acceptable (50%, borderline Poor)** |

## Design Specificity Verdict

**LLM assessment**: Generic contact-page template with a bakery paint job. The structure (icon-card info column + form card + FAQ grid) is a default SaaS/agency pattern; none of PRODUCT.md's rich operating specificity (2pm cutoff, Monday-only shipping, Saturday farmers-market pickup) survives into this page's copy. The FAQ half-tries but stays shallow.

**Deterministic scan**: `detect.mjs` ran clean (0 findings). As with other surfaces, the detector's HTML/CSS rules can't catch a form that fakes its success state or hrefs that don't match their display text — those require reading the actual logic and cross-referencing content.

**Visual overlays**: Not attempted — user policy disallows dev server/browser automation.

## Overall Impression

This page looks the most "finished" visually of anything reviewed so far, which makes its core defect more dangerous, not less: **the contact form does not send anything anywhere**. `handleSubmit` awaits a fake `setTimeout` and unconditionally shows "Message Sent!" — no `/api/contact` route exists in the project at all. Every message a visitor submits, including corporate/catering leads funneled here from the corporate page and the FAQ's own promised "Catering Request Form," is silently discarded while the UI confidently confirms success.

## What's Working

- Clean visual rhythm and restrained card-based layout — the most finished-looking surface reviewed.
- Correct semantic form/label wiring (Radix `Label` + matched `htmlFor`/`id`) and clean heading hierarchy — the accessible skeleton is sound.
- The FAQ section is a smart inclusion, reducing "why would I even email them" friction for common questions.

## Priority Issues

- **[P0] Contact form is entirely non-functional and lies about success** — `handleSubmit` never calls any API; no `/api/contact` route exists anywhere in the project. Every visitor message — including corporate/catering leads, arguably the highest-margin conversions per PRODUCT.md — is silently dropped while the UI shows "Message Sent!" **Why it matters**: this is a direct, measurable business-impact bug for a solo-operator bakery whose owner needs these messages, and it's invisible to her too — she has no way of knowing she's missing messages. **Fix**: wire this to a real endpoint (the footer's newsletter form on this same page already proves the team knows how to build a real fetch + honest loading/success/error pattern — mirror that). **Suggested command**: `/impeccable harden`

- **[P0] mailto/tel hrefs don't match their displayed labels** — `mailto:hello@bliss-b.com` displays as `blissbdesserts@gmail.com`; `tel:+15551234567` (a leftover placeholder number) displays as `+1 (470) 883-5035`. Clicking "call us" dials a different number than what's printed. **Why it matters**: actively misdirects customers on the two lowest-friction contact channels on the page — a trivial fix with real, immediate impact. **Fix**: align the href to match the displayed value. **Suggested command**: `/impeccable harden`

- **[P1] No error state / no real submission feedback loop exists** — once a real backend is wired in, there's no error branch to build on; `handleSubmit` needs a full rewrite, not a patch. **Suggested command**: `/impeccable harden`

- **[P2] Color-token drift, confirmed here with new evidence** — page background `#F8F4F0` vs. sitewide `--brand-bg:#F8EDE4` vs. `corporate/page.tsx`'s distinct third brown `#C08552` for CTAs — three unreconciled "browns" exist simultaneously across the codebase. **Suggested command**: `/impeccable document`, then Fase 3 unification.

- **[P3] No `prefers-reduced-motion` guard** on the page-wide spring animations (every section uses `framer-motion`), inconsistent with a calm "reach out to us" surface. **Suggested command**: `/impeccable audit`

## Persona Red Flags

**Corporate/event customer (PRODUCT.md's secondary audience)**: funneled here from the corporate page's "Contact Form" CTA to submit a catering inquiry — the highest-value lead type on this page — and gets a fake confirmation. This persona is the single most damaged by the P0 form bug.

**Individual customer with an order problem**: trusts the "We typically respond within 24 hours" line and the false "Message Sent!" confirmation — will wait, get nothing, and conclude the bakery ignored them, directly damaging the "personal service" brand promise.

**Store owner (non-technical, solo operator)**: has no visibility that this page is failing — she doesn't know she's missing messages, arguably the most dangerous part of this bug since it's invisible to the one person who could catch it.

## Minor Observations

- `<title>` metadata reads "Blisb Bakery store" — a third spelling variant of the brand name, on top of the already-known "Blissb"/"Bliss-B" inconsistency.
- The footer (visible on this page) says "Bliss-B Bakery" while PRODUCT.md specifies "Bliss-B Desserts" as the business name.
- The FAQ's allergen answer is good, honest content — worth using as the template tone for the rest of the page's copy.
- Focus-visible ring color on form inputs uses the generic `--ring` token rather than brand brown — small polish gap.
- The footer's own newsletter form on this same page (wired to `/api/subscribe` → MailerLite + Strapi, confirmed real and functional) proves the team can build this pattern correctly — the contact form's simulated `setTimeout` is a regression relative to working code sitting right next to it.

## Questions to Consider

1. If the footer's newsletter signup on this exact page already proves the team can wire a form to a real backend with honest success/error states, why does the contact form next to it simulate success instead?
2. Given corporate/catering leads are funneled specifically into this broken form, how many inquiries has the business already silently lost since this page went live?
3. When Fase 3 (brand token unification) happens, is the plan to grep-and-replace hex literals, or will pages keep drifting because the tokens aren't enforced anywhere (lint rule, Tailwind theme extension)?
