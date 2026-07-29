# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are individual customers ordering baked goods (cookies, cakes, desserts) for personal consumption, gifting, or small celebrations, browsing and paying online. A secondary audience is corporate/event customers ordering cookie/dessert carts and corporate gift boxes for offices and celebrations. The store owner (non-technical) is also a key user of the Strapi admin and, eventually, a lightweight seasonal-personalization panel.

## Product Purpose

An online storefront for Bliss-B Desserts, a small-batch bakery based in Braselton, GA. Customers browse a catalog (cookies, cakes, desserts), customize flavors, and complete payment via Stripe, choosing pickup, local delivery, or nationwide shipping. Success means completed, correctly-priced orders with accurate inventory and reliable order notifications reaching the owner.

## Positioning

An artisanal, small-batch home bakery (not a mass-market or wholesale operation), with public recognition — Top 5 in Georgia's biggest dessert competition (2024) and Top 20 desserts nationally (2023) — competing on craft and personal service rather than price or scale.

## Operating Context

- Order windows: online orders Tuesday–Friday with a 2:00pm cutoff; orders before cutoff get same-day delivery (2–6pm window) or pickup (6–8pm); orders after cutoff move to the next day.
- Monday: shipping only (UPS), no delivery/pickup.
- Saturday: pickup only, at Suwanee Farmers Market, 8am–12pm.
- Delivery origin: 111 Manor Way, Braselton, GA 30517. Delivery radius 25 miles; beyond that, only shipping or in-store pickup is offered.
- Backend: Strapi Cloud (content/catalog/inventory). Frontend: Next.js on Vercel. Payments: Stripe. Transactional email: Resend. Newsletter: MailerLite (with subscribers also mirrored into Strapi for owner visibility).
- The owner runs day-to-day operations solo or with minimal help and is not a developer — future admin-facing features (event postings, date blocking, seasonal theming) must be usable without code changes.

## Capabilities and Constraints

- Products can require flavor selection; customers may split up to 3 flavors across a quantity (fixed for box products like the Mini Cookie Box, customer-chosen for regular items).
- Server-side inventory and price validation at checkout (Strapi is the source of truth, never trust client-submitted prices/quantities).
- Minimum order subtotal of $20 to check out.
- Stock is tracked internally but never exposed to shoppers in the UI.
- Currently mid-implementation of a phased improvement plan (see project history / proposal doc) covering: critical bug fixes, flavor checkboxes everywhere (done), delivery-window redesign, real-mileage delivery pricing via Google Maps, discount coupons, manual date-blocking for delivery/pickup, brand visual consistency, UX polish, an events section, and seasonal (holiday) theming controlled by the owner.
- Undecided: which 4–6 brand colors the owner wants exposed as owner-editable (open item from the proposal); scope/timing of the Pushover push-notification feature (explicitly deferred by the user for now).

## Brand Commitments

- Business name: **Bliss-B Desserts** / **Bliss-B**. The name currently appears inconsistently across the site as "Blissb", "Bliss-B", and "Blisb" — unifying this is a confirmed, explicit to-do (not yet done).
- Existing color usage (browns, greens, creams) is currently inconsistent across components; unifying it into a single token-based palette is a confirmed upcoming phase (Fase 3), which is also the prerequisite for a later owner-controlled seasonal theming panel.

## Evidence on Hand

- Real product catalog and images live in Strapi Cloud (categories: cookies, cakes, desserts), fetched live — no placeholder/fake product data should be introduced.
- Public awards claims already on the live site: "Top 5" in Georgia's biggest dessert competition (2024) and "Top 20 desserts across the country" (2023). Treat these as existing, real claims to preserve, not to be invented or embellished further.
- Do not fabricate testimonials, pricing tiers, or additional awards beyond what's already confirmed above.

## Product Principles

1. Never let the UI show something the backend can't honor — inventory, pricing, and availability are always server-validated.
2. The owner must be able to operate day-to-day (events, blocked dates, seasonal look) without developer help, once those panels exist.
3. Checkout clarity over cleverness — the customer should never be confused about whether an order/payment is actually confirmed (this is explicitly why the order-confirmation step is being redesigned).
4. One consistent brand voice and palette across the whole site, defined in one place, not per-component.
5. Small-batch/artisanal positioning should read through craft and care in the UI, not generic e-commerce templating.

## Accessibility & Inclusion

No project-specific accessibility requirement has been established yet.
