---
target: corporate page
total_score: 15
max_score: 28
na_heuristics: 5,7,10
p0_count: 1
p1_count: 2
timestamp: 2026-07-28T22-53-01Z
slug: blissb-ecommerce-src-app-corporate-page-tsx
---
Method: dual-agent (A: a87312eeb9440484a · B: aaaa43ce3e165b127)
Note: Browser visualization skipped for both assessments (user policy disallows dev-server/browser automation). Source-only design review + CLI-detector-only evidence.
Scope: `blissb-ecommerce/src/app/corporate/page.tsx`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | The "Contact Form" CTA leads to a page that fakes success; `sms:` links give zero feedback on desktop |
| 2 | Match System / Real World | 3 | Menu items and use cases match real bakery/event language well |
| 3 | User Control and Freedom | 3 | Standard nav/back available, nothing traps the user |
| 4 | Consistency and Standards | 1 | A third and fourth off-brand brown (`#C08552`, `#A66F42`) used only on this page, vs. `#8F4B2B` everywhere else |
| 5 | Error Prevention | n/a | No form exists on this page itself (the form lives on `/contact`, out of this surface's scope) |
| 6 | Recognition Rather Than Recall | 3 | Menu/use-case lists are visible and scannable without requiring memory |
| 7 | Flexibility and Efficiency | n/a | Static informational/persuade page; no power-user path applies |
| 8 | Aesthetic and Minimalist Design | 3 | Clean alternating sections, restrained imagery-to-text ratio |
| 9 | Error Recovery | 1 | No error states exist for the dead-end sms/contact CTAs; failure is silent |
| 10 | Help and Documentation | n/a | Not a task-completion surface; though a B2B FAQ (invoicing/lead-time) would fit and is absent |
| **Total** | | **15/28** | **Acceptable (54%)** |

## Design Specificity Verdict

**LLM assessment**: Mixed — the catering menu content (Cookie Cups, Tres Leches Shots, Mini Alfajores) is genuinely specific to this bakery's Latin-influenced lineup, but everything else reads as generic B2B/catering boilerplate. Critically, there is no pricing, no minimum order size, and no lead-time/booking-window guidance anywhere on this page, despite these being the first questions any office/event buyer needs answered before committing company budget. The one lead-time hint in the whole codebase ("at least 2 weeks before your event") lives on a different page's FAQ, not here. Verdict: template-with-real-menu-data, not a fully bespoke B2B offer page.

**Deterministic scan**: `detect.mjs` ran clean (0 findings). As with other surfaces, the detector doesn't catch invalid `<a><button>` nesting, sub-AA contrast on non-large CTA text, or the page routing 100% of its high-intent CTAs to a form that fakes success — all confirmed by reading the source directly.

**Visual overlays**: Not attempted — user policy disallows dev server/browser automation.

## Overall Impression

The one genuinely bakery-specific asset here (the catering menu) is undercut by a page that gives a B2B buyer no numbers to act on and then routes every "serious inquiry" CTA to a contact form already confirmed non-functional elsewhere in this review — a corporate lead who completes the funnel as designed still doesn't reach the owner.

## What's Working

- Real, brand-specific catering menu (Alfajores, Tres Leches Shots, NY Style Cookies) reads authored, not templated.
- Clean alternating section rhythm (white / cream / white) with a consistent image-text split gives visual variety without chaos.
- Sensible use-case tagging (weddings, corporate events, pop-ups) shows the page was written with real customer scenarios in mind.

## Priority Issues

- **[P0] All 3 sections' primary "Contact Form" CTA routes to `/contact`, already confirmed to fake success with no real backend** — this is the page's only "serious inquiry" path for every one of its three offers; a corporate buyer believes their catering/gifting/cart request was sent when it wasn't. **Suggested command**: shared root cause with the contact-page P0 above — `/impeccable harden` on `/contact` fixes this page too.

- **[P1] CTA text fails WCAG AA contrast** — `#C08552` on white (or white-on-`#C08552`) computes to ~3.13:1, below the 4.5:1 required for the non-large "Text Us"/"Contact Form" button labels — the literal call-to-action text. **Suggested command**: `/impeccable audit`

- **[P1] Invalid `<a><button></button></a>` nesting on all 6 CTAs** — every CTA wraps a shadcn `Button` inside a `next/link` `Link` without `asChild`, breaking keyboard/screen-reader interaction on the only interactive elements on the page. **Fix**: add `asChild` to `Button` per shadcn convention. **Suggested command**: `/impeccable audit`

- **[P2] Zero pricing, minimum order, or lead-time information anywhere on the page** — despite these being the first questions any office/event buyer needs answered. **Suggested command**: `/impeccable clarify`

- **[P2] A third and fourth off-brand brown (`#C08552`, `#A66F42`) used exclusively on this page**, vs. `#8F4B2B` everywhere else (Header, Footer, Hero, Checkout, Contact) — a corporate buyer moving between this page and the rest of the funnel sees a visibly different accent color. **Suggested command**: Fase 3 token-unification work should treat this page as a concrete test case.

- **[P3] `sms:` links as a primary CTA path with no desktop fallback**, and no page-level `<title>`/metadata for `/corporate` (weak for a B2B page likely bookmarked/shared internally). **Suggested command**: `/impeccable harden`

## Persona Red Flags

**Corporate-buyer persona ("office manager ordering for 30 people quarterly")**: bounces immediately at the missing pricing/minimum-order info, then hits the fake-success contact form as a second failure — two independent trust breaks before any human contact is made. No invoicing/tax-exempt/cancellation info compounds the risk-aversion this persona typically has with company spend.

**Riley (accessibility-sensitive/keyboard user)**: directly blocked by the invalid `<a><button>` nesting and sub-AA contrast CTAs — the two concrete, verifiable defects in this review.

## Minor Observations

- "Mini Grans Cheesecake" is very likely a typo for "Mini Grand Cheesecake" — a menu-item typo that undercuts credibility for a buyer scrutinizing the offer.
- Hero image `alt="Cookie Cups"` for what's presumably a broader catering spread image likely under-describes the actual content.
- No `<ul>/<li>` semantics for the two bulleted lists (menu items, use cases) — screen readers won't announce list length/position.
- `WaveDivider` is passed `className="absolute bottom-0 left-0 right-0"` on top of its own hardcoded `"relative "` prefix, and none of the three parent `<section>`s declare `position: relative` — a self-contradictory class combination that needs visual verification once the user can check it themselves.
- Order of sections (Catering → Corporate Gifting → Cookie Cart) has no stated rationale and no in-page navigation/anchors for a buyer who already knows which of the three they want.

## Questions to Consider

1. If every CTA on this page terminates at a form that silently fakes success, what is the actual mechanism today by which a corporate lead reaches the owner — and does the business know how many real inquiries this page has quietly swallowed?
2. Why does this page — arguably the one place a buyer needs hard numbers to get budget approval — carry zero pricing or minimum-order information, when the rest of the app enforces a strict $20 checkout minimum and server-validated pricing elsewhere?
3. Was `#C08552` on this page a deliberate "corporate" sub-brand choice, or incidental drift — and should the upcoming Fase 3 token-unification work treat this page as its first test case?
