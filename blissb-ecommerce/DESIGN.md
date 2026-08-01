---
name: Bliss-B Desserts
description: Handmade cookies, cakes, and desserts — warm artisanal storefront with a distraction-free checkout.
colors:
  paper: "#FDFBF8"
  ink: "#211A16"
  brand-brown: "#9B562C"
  brand-brown-hover: "#7A4522"
  muted: "#6B5D54"
  border: "#E4DCD3"
  brand-accent: "#C58B66"
  success: "#7A4522"
  success-hover: "#5C3319"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
components:
  button-primary:
    backgroundColor: "{colors.brand-brown}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  button-primary-hover:
    backgroundColor: "{colors.brand-brown-hover}"
---

# Design System: Bliss-B Desserts

## 1. Overview

**Creative North Star: "The Home Kitchen Counter"**

Bliss-B Desserts reads like a real bakery counter, not a food-delivery app: warm paper-toned surfaces, one confident brown carrying the brand's identity, real product photography doing the persuading instead of illustration or gradients. The storefront (home, categories, marketing) leans toward warmth and texture; the transactional flow (cart, checkout) tightens up — same palette, but the register shifts from persuasion to clarity, because at that point the customer has already decided and just needs the order to go smoothly.

This system explicitly rejects the generic SaaS-template look: no cream-plus-gradient hero clichés, no corporate coldness, no invented urgency (fake countdown timers, "only 2 left" badges) — stock, delivery windows, and pricing shown are always real.

**Key Characteristics:**
- One brand brown (#9B562C) carries identity; used deliberately, not smeared across every element.
- Warm near-white paper background (#FDFBF8), not a stark white or a saturated cream cliché.
- Serif-weight display face (Bricolage Grotesque) paired with a plain workhorse sans (Inter) for body/UI text.
- Soft, rounded geometry (8–14px radii) over sharp corporate edges.
- Checkout narrows the palette further: functional clarity over brand flourish.

## 2. Colors

A restrained, single-accent palette: warm neutrals do the heavy lifting, brand brown appears only where it means something (primary actions, selected states, key numbers).

### Primary
- **Kitchen Brown** (`#9B562C`): primary actions — buttons, selected radio/step states, links. Pulled directly from the real logo, not invented.
- **Kitchen Brown, Deep** (`#7A4522`): hover/active state for Kitchen Brown; also doubles as the success color (order confirmed, step completed) since both signal "this is handled."

### Secondary
- **Toasted Sugar** (`#C58B66`): the logo's lighter tone — badges, small accents, award/highlight chips. Never used for primary CTAs.

### Neutral
- **Warm Paper** (`#FDFBF8`): page background. Deliberately not a saturated cream/sand — kept close to white with only a whisper of warmth so it doesn't read as an AI-default "parchment" palette.
- **Kitchen Ink** (`#211A16`): primary text. Warm near-black, not pure `#000`.
- **Muted Cocoa** (`#6B5D54`): secondary/supporting text — descriptions, helper copy, timestamps.
- **Flour Line** (`#E4DCD3`): 1px borders and dividers only. Never used as a fill.

### Named Rules
**The One Brown Rule.** Kitchen Brown is the only saturated color allowed to carry meaning (action, selection, success). Toasted Sugar is decorative only. Don't introduce a second "brand" hue anywhere in the product.

## 3. Typography

**Display Font:** Bricolage Grotesque (with sans-serif fallback)
**Body Font:** Inter (with sans-serif fallback)

**Character:** Bricolage Grotesque's slightly quirky, warm geometry gives headings personality without tipping into a script or overly decorative serif — it reads handmade, not corporate. Inter carries everything functional (body copy, forms, buttons) with total clarity, which matters most in checkout.

### Hierarchy
- **Display** (600 weight, Bricolage Grotesque): page/section headings on storefront pages (product names, hero copy).
- **Title** (600 weight, Inter): step titles, card headings, "Order Summary" — sized clearly above body but not competing with Display.
- **Body** (400 weight, Inter, 14–16px): descriptions, form labels, line-item text. Cap prose at ~70ch.
- **Label** (500 weight, Inter, 12–13px): badges, fee labels, helper/error text under inputs.

### Named Rules
**The Checkout Sobriety Rule.** Inside `/checkout`, Bricolage Grotesque is used sparingly if at all — step titles and totals favor Inter's clarity over Bricolage's personality. Save display flourish for the storefront, where persuasion is the job.

## 4. Elevation

The system is flat-by-default: surfaces are distinguished by the Flour Line border (`#E4DCD3`) and subtle background tint (white card on Warm Paper background), not by drop shadows. Shadows appear only as a light, ambient lift on interactive hover states (product cards) — never as a resting decoration.

### Named Rules
**The Flat-By-Default Rule.** No shadow at rest. A shadow only ever appears in response to a state change (hover/focus), and even then it stays soft — no hard-edged card shadows anywhere in the product.

## 5. Components

### Buttons
- **Shape:** rounded corners (`lg`, 10px).
- **Primary:** Kitchen Brown background, Warm Paper text, comfortable horizontal padding (not cramped).
- **Hover / Focus:** background steps to Kitchen Brown Deep; focus state gets a visible outline/ring for keyboard users (WCAG AA).
- **Secondary / Ghost:** Flour Line border, Kitchen Ink text, transparent fill — used for "Edit" links and non-committal actions (e.g. stepper "Edit" on a completed step).

### Chips / Badges
- **Style:** Toasted Sugar or Flour Line background depending on context (award badge vs. neutral tag), Kitchen Ink or Kitchen Brown text, no border.
- **State:** fee/status badges (e.g. "Free", "Out of range") use semantic tints — success uses Kitchen Brown Deep on a light tint, warning/error uses a restrained red, never neon.

### Cards / Containers
- **Corner Style:** 10px radius (`lg`).
- **Background:** white or Warm Paper, one shade lighter/darker than the page background so the card reads as a distinct surface without a shadow.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** 1px Flour Line.
- **Internal Padding:** consistent single scale per card — do not stack a padding override on `CardContent` on top of the `Card` wrapper's own padding; pick one owner of vertical padding per card.

### Inputs / Fields
- **Style:** Flour Line 1px border, Warm Paper or white fill, `lg` (10px) radius.
- **Focus:** border shifts to Kitchen Brown, no glow/gradient ring.
- **Error:** red border + inline red helper text with an icon (see `DeliverySelector`'s existing pattern) — never a plain color change with no text explanation.

### Navigation
- **Storefront header:** full nav, search, cart icon, brand-brown accents on hover/active links.
- **Checkout header (`CheckoutHeader`):** intentionally minimal — small logo linking home + "Secure checkout" label, no nav/search/cart. This isn't a stripped-down version of the main header; it's a deliberately different, quieter component for the `product`-register checkout flow.

### Stepper (signature component)
The checkout's vertical stepper (`Step` in `checkout/page.tsx`) is the flow's signature pattern: numbered circle (fills to a checkmark in Kitchen Brown once done), title, one-line summary when collapsed, full form when active, "Edit" ghost-link to reopen a completed step. Strictly sequential — no skipping ahead. This replaces a tab/segmented-control pattern the user explicitly rejected as feeling non-standard for checkout.

## 6. Do's and Don'ts

### Do:
- **Do** keep checkout's palette identical to the storefront's — same brand brown, same paper background — the shift is in density and distraction (fewer elements), not in color.
- **Do** use the vertical vertical numbered stepper for any future multi-step flow; it's the established, user-approved pattern — don't reach for tabs.
- **Do** show real, server-validated numbers (fees, totals, tax) at every step; never display an estimate the backend hasn't confirmed once that data is available.
- **Do** keep card padding to a single owner (`Card` OR `CardContent`, not both) to avoid the oversized-card bug this project has hit before.

### Don't:
- **Don't** ship a generic SaaS-template look — no gradient hero, no cream-plus-gradient combo, no corporate coldness.
- **Don't** invent urgency or fake scarcity (countdown timers, "X left" badges) — stock and delivery windows shown must be real.
- **Don't** add a second saturated brand color; Toasted Sugar is decorative-only, never a competing CTA color.
- **Don't** reintroduce a Tabs-based navigation in checkout — explicitly rejected as "no se siente standard."
- **Don't** center two side-by-side panes independently with their own `mx-auto`; it creates a large visual gap at the seam (hit this bug once already in checkout's two-pane layout).
