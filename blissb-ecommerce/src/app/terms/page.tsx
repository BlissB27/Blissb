import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Bliss-B Desserts",
  description: "The terms that govern using the Bliss-B Desserts website and placing an order with us.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "August 2, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-brand-text mb-3">{title}</h2>
      <div className="space-y-3 text-brand-muted leading-relaxed">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-2">Terms of Service</h1>
        <p className="text-sm text-brand-muted mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="1. Who we are">
          <p>
            Bliss-B Desserts (&quot;Bliss-B,&quot; &quot;we,&quot; &quot;us&quot;) is a home bakery based at 111 Manor
            Way, Braselton, GA 30517. These Terms of Service govern your use of blissbbakery.com (the
            &quot;Site&quot;) and any order you place through it.
          </p>
        </Section>

        <Section title="2. Orders and payment">
          <p>
            All orders are subject to a $20 minimum subtotal and to product availability. Prices shown at
            checkout are in US dollars and include applicable sales tax and any card processing fee. Payment is
            processed securely by Stripe at the time of order — we never see or store your full card number.
          </p>
          <p>
            We reserve the right to refuse or cancel an order — for example if an item is out of stock, if we
            suspect fraud, or if we&apos;re unable to fulfill it by the requested date.
          </p>
        </Section>

        <Section title="3. Fulfillment: pickup, delivery, and shipping">
          <p>
            Fulfillment windows, local delivery pricing, and shipping days are described in full on our{" "}
            <Link href="/policies" className="text-brand-brown hover:underline">
              Policies
            </Link>{" "}
            page, which is part of these Terms. Delivery fees are calculated by real driving distance from our
            bakery. We ship nationwide within the United States via UPS, every Monday.
          </p>
        </Section>

        <Section title="4. Cancellations, refunds, and returns">
          <p>
            Because our products are perishable and handmade to order, we do not accept returns or exchanges,
            and all sales are final once preparation has begun. Cancellations or changes must be requested at
            least 3 business days before your scheduled pickup, delivery, or ship date — see{" "}
            <Link href="/policies" className="text-brand-brown hover:underline">
              Policies
            </Link>{" "}
            for details. If your order arrives damaged or incorrect, contact us within 24 hours with a photo and
            we&apos;ll make it right.
          </p>
        </Section>

        <Section title="5. Allergens">
          <p>
            All Bliss-B products are made in a shared kitchen that also processes wheat, dairy, eggs, tree nuts,
            peanuts, and soy. We list known allergens per product on our{" "}
            <Link href="/allergens" className="text-brand-brown hover:underline">
              Allergen Information
            </Link>{" "}
            page, but we cannot guarantee any product is free of cross-contact. If you have a severe allergy,
            please contact us before ordering.
          </p>
        </Section>

        <Section title="6. Using the Site">
          <p>
            You agree to use the Site only for lawful purposes, to provide accurate information when ordering
            (name, contact details, and delivery/shipping address), and not to attempt to disrupt or abuse the
            Site, including any of its ordering, payment, or email systems.
          </p>
        </Section>

        <Section title="7. Intellectual property">
          <p>
            The Bliss-B Desserts name, logo, and the photography, text, and design on this Site are owned by
            Bliss-B Desserts and may not be reproduced without permission.
          </p>
        </Section>

        <Section title="8. Liability">
          <p>
            Bliss-B Desserts is not liable for delivery or shipping delays caused by an incorrect address
            provided at checkout, carrier delays, weather, or other circumstances outside our reasonable
            control. To the fullest extent permitted by law, our liability for any order is limited to the
            amount paid for that order.
          </p>
        </Section>

        <Section title="9. Changes to these terms">
          <p>
            We may update these Terms from time to time. Changes take effect once posted on this page, so
            please check back periodically.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>
            Questions about these Terms? Reach us at{" "}
            <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
              blissbdesserts@gmail.com
            </a>{" "}
            or{" "}
            <a href="tel:+14708835035" className="text-brand-brown hover:underline">
              (470) 883-5035
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
