# Design System — Bliss-B Desserts

<!-- impeccable:design-schema 1 -->

## Direction

**THESIS:** A confident, modern bakery-retail identity — high-contrast, product-photography-first, editorial-clean — refusing the generic "cream background + rounded-everything + muddy brown" e-commerce-template default.

**Reference world:** krokemcookies.com's essence (clean near-white ground, high-contrast near-black text, bold confident sans headlines, minimal ornament, product-photography-forward cards) translated into Bliss-B's own palette — not a copy of Krokem's brand, its craft level and restraint.

**STORY:** A first-time visitor reads "real, award-winning small bakery with its own identity," not "generic template." The product grid and product page are the site's best-crafted surfaces, not its worst.

## Color tokens (Committed strategy — one saturated color owns 30–60% of the surface)

| Token | Value | Role |
|---|---|---|
| `--brand-bg` (paper) | `#FDFBF8` | Warm near-white ground. Not a heavy cream field. |
| `--brand-text` (ink) | `#211A16` | Primary text/headlines. Warm near-black, real contrast. |
| `--brand-brown` (brand) | `#9B562C` | The committed color — nav, solid buttons, active states, price. **Exact tone from the real logo** (`logobb.png`), not invented. |
| `--brand-brown-hover` | `#7A4522` | Hover/darken shade of brand. |
| `--brand-accent` | `#C58B66` | Sparing use — badges, awards, highlights. **The logo's lighter tone**, not invented. |
| `--brand-success` | `#7A4522` | Order confirmation / discount-applied states. Deliberately the same warm brown family, **not green** — the client asked for zero green anywhere in the UI. |
| `--brand-success-hover` | `#5C3319` | Hover/darken shade of success. |
| `--brand-muted` | `#6B5D54` | Secondary/muted text. |
| `--brand-border` | `#E4DCD3` | Neutral 1px borders. Not used as decorative color. |

Deliberately **not** cream-ground + serif + terracotta (the recognized AI-generated-site cluster): ground is near-white, no serif anywhere. `brand-brown`/`brand-accent` are pinned to the client's actual logo colors, not a freely-chosen palette.

## Typography

- **Display / headlines:** Bricolage Grotesque (weight 600–800). Bold, confident grotesque with real character — used for `h1`–`h3`, hero copy, section titles.
- **Body / UI:** Inter. Clean workhorse sans for paragraphs, labels, form fields, buttons.
- Both loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-display` and `--font-sans`.

## Components

- **Buttons:** one language, owned by `components/ui/button.tsx`'s CVA variants so every instance inherits it automatically.
  - `default`: solid `brand` fill, white text, hover = `brand-brown-hover` + a subtle shadow lift. No scale-bounce.
  - `outline`: `brand`-colored border and text, fills solid `brand` (white text) on hover.
  - Never override button colors per-instance; add a variant if a new treatment is genuinely needed.
- **Cards:** one radius scale — `rounded-2xl` for feature/product cards, `rounded-full` for pills/badges. Neutral 1px `border-brand-border`, never a colored "accent" border as decoration (no side-tab pattern).
- **Icons:** `lucide-react` only (the one exception: `react-icons`' TikTok glyph, since lucide has no TikTok mark). Consistent `strokeWidth={1.75}` everywhere. No emoji anywhere in the UI.

## Motion

- `MotionConfig reducedMotion="user"` wraps the whole app (`app/layout.tsx`) — every `framer-motion` animation automatically respects `prefers-reduced-motion`.
- Buttons: color + shadow only, no scale transforms.

## Component patterns confirmed after first client feedback round

- **Product grid cards are uniform, no exceptions.** Flavor selection (checkboxes) and the optional custom-message field never render inline on a grid card — they open in a modal (`Dialog`) triggered by a single "Add to Cart" button at the bottom of every card, so no card is taller than another regardless of the product's options. The product detail page is the one place flavor selection still renders inline (a dedicated single-product page has no grid-uniformity constraint).
- **No green anywhere.** Even semantic "success" states use a darker `brand` shade, never a separate hue.
- **Homepage product browsing is category-sectioned**, not a single tabbed/filtered grid — one section per category (Cookies, Cakes, Desserts), each with a "View all" link to its full category page.
- **Nav items don't hide behind a dropdown for a single destination** — a dropdown menu needs at least two real choices, otherwise it's a direct link.

## What this replaces

Superseded: the previous `--brand-bg #F8F4F0` / `--brand-brown #8F4B2B` token set (unified from pre-existing hardcoded hex values, never a deliberate design decision), Geist/Geist Mono fonts, and per-component ad-hoc button/card styling.
