import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bliss-B Desserts",
  description: "How Bliss-B Desserts collects, uses, and protects your information when you order or browse our site.",
  alternates: { canonical: "/privacy" },
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-2">Privacy Policy</h1>
        <p className="text-sm text-brand-muted mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="1. What this covers">
          <p>
            This Privacy Policy explains what information Bliss-B Desserts (&quot;we,&quot; &quot;us&quot;)
            collects through blissbbakery.com, why we collect it, and who we share it with. It applies to
            anyone browsing the Site or placing an order.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <p>When you place an order, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name, email address, and phone number</li>
            <li>Your billing address, and your delivery or shipping address if different</li>
            <li>Order details — items, flavors, quantities, and any gift message you add</li>
          </ul>
          <p>
            We do not collect or store your card number — payment is entered directly into Stripe&apos;s secure
            payment form and processed by Stripe.
          </p>
          <p>
            If you subscribe to our newsletter, we collect your email address. If you use the address
            autocomplete field at checkout, the text you type is sent to Google&apos;s Places API to suggest
            matching addresses.
          </p>
        </Section>

        <Section title="3. How we use your information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To prepare, confirm, and fulfill your order, and to contact you about it</li>
            <li>To calculate accurate local delivery pricing based on distance from our bakery</li>
            <li>To send you a receipt and order confirmation by email</li>
            <li>To send you newsletter or promotional emails, only if you&apos;ve opted in — you can unsubscribe at any time</li>
            <li>To keep the Site secure and prevent fraud or abuse</li>
          </ul>
        </Section>

        <Section title="4. Who we share it with">
          <p>We share information only with the services that help us run the Site and fulfill your order:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-brand-text">Stripe</strong> — processes payment and, for delivery/shipping orders, receives your address</li>
            <li><strong className="text-brand-text">Strapi</strong> (our product catalog) and hosting providers that run the Site</li>
            <li><strong className="text-brand-text">Resend</strong> — sends order confirmation emails on our behalf</li>
            <li><strong className="text-brand-text">Google Maps Platform</strong> — used server-side to suggest addresses and calculate delivery distance</li>
            <li><strong className="text-brand-text">Mailerlite</strong> — sends newsletter emails, only if you&apos;ve subscribed</li>
          </ul>
          <p>We never sell your personal information.</p>
        </Section>

        <Section title="5. Cookies and local storage">
          <p>
            We use your browser&apos;s local storage to remember your cart and delivery preferences between
            visits — this stays on your device and isn&apos;t used to track you across other websites. The
            &quot;Follow Along&quot; Instagram feed on our homepage is embedded from a third party (Behold) and
            may set its own cookies when it loads.
          </p>
        </Section>

        <Section title="6. Data retention">
          <p>
            We keep order records for as long as needed for accounting, tax, and customer service purposes.
            Payment details are retained by Stripe according to their own retention policy, not by us.
          </p>
        </Section>

        <Section title="7. Your choices">
          <p>
            You can unsubscribe from marketing emails at any time using the link at the bottom of any
            newsletter email. To request a copy of the information we hold about you, or to ask us to delete
            it, email{" "}
            <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
              blissbdesserts@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="8. Children">
          <p>Bliss-B Desserts is not directed at children under 13, and we don&apos;t knowingly collect information from them.</p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>We may update this Privacy Policy from time to time. Changes take effect once posted on this page.</p>
        </Section>

        <Section title="10. Contact us">
          <p>
            Questions about this Privacy Policy? Reach us at{" "}
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
