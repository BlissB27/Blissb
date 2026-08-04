"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, MapPin, Truck, Clock, AlertCircle, RefreshCw, X, type LucideIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { WaveDivider } from "@/components/WaveDivider";

type PolicySection = {
  Icon: LucideIcon;
  title: string;
  items: ReactNode[];
};

const POLICY_SECTIONS: PolicySection[] = [
  {
    Icon: Clock,
    title: "Ordering Schedule",
    items: [
      <>
        <strong className="text-brand-text">Monday:</strong> shipping only (UPS). Local delivery and pickup aren&apos;t available on Mondays.
      </>,
      <>
        <strong className="text-brand-text">Tuesday–Friday:</strong> online orders have a 2:00pm cutoff. Order before 2:00pm for same-day local delivery (2pm–6pm) or same-day pickup (6pm–8pm). Order after 2:00pm and it rolls to the next available day.
      </>,
      <>
        <strong className="text-brand-text">Saturday:</strong> pickup only, at the Suwanee Farmers Market, 8am–12pm.
      </>,
      <>
        The minimum order subtotal to check out is <strong className="text-brand-text">$20</strong>.
      </>,
    ],
  },
  {
    Icon: Truck,
    title: "Local Delivery",
    items: [
      <>
        We deliver within a <strong className="text-brand-text">25-mile radius</strong> of our bakery at 111 Manor Way, Braselton, GA 30517. Enter your address at checkout to see your exact delivery fee, calculated by real driving distance.
      </>,
      <>
        Delivery fees: <strong className="text-brand-text">free within 7 miles</strong>, $7 for 7.1–12 miles, $10 for 12.1–17 miles, and $15 for 17.1–25 miles.
      </>,
      <>
        Delivery is <strong className="text-brand-text">free on any order of $60 or more</strong>, regardless of distance, as long as it&apos;s within the 25-mile radius.
      </>,
      <>Beyond 25 miles, local delivery isn&apos;t available — please choose nationwide shipping or in-store pickup instead.</>,
    ],
  },
  {
    Icon: MapPin,
    title: "Pick-Up Days and Policies",
    items: [
      <>
        <strong className="text-brand-text">Tuesday–Friday:</strong> pickup at 111 Manor Way, Braselton, GA 30517, between 6pm–8pm (same-day if ordered before the 2:00pm cutoff).
      </>,
      <>
        <strong className="text-brand-text">Saturday:</strong> pickup only at the Suwanee Farmers Market, 8am–12pm.
      </>,
      <>
        If you need to arrange a pick-up on a different day or time, please contact us at{" "}
        <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
          blissbdesserts@gmail.com
        </a>{" "}
        so we can work out a mutually convenient option.
      </>,
      <>Please note that orders not collected at the agreed-upon date and time will not qualify for a refund or store credit for a new order.</>,
    ],
  },
  {
    Icon: Package,
    title: "Shipping Days and Policies",
    items: [
      <>We ship every Monday using UPS, exclusively within the United States.</>,
      <>
        Bliss-B Desserts is not liable for any delays in delivery due to errors or omissions in the shipping address provided by the customer. We also cannot be held responsible if a package, even if marked as &quot;delivered,&quot; is later reported lost.
      </>,
      <>In cases where shipments are returned because of an incorrect or incomplete address, additional charges will apply for re-shipment.</>,
      <>Shipping fees are non-refundable if there are delays caused by inaccessible delivery sites or closed locations.</>,
      <>Please be aware that estimated delivery times do not account for unforeseen weather disruptions or delays due to high volume experienced by shipping carriers.</>,
    ],
  },
  {
    Icon: X,
    title: "Refunds and Returns",
    items: [
      <>Due to the perishable nature of our products and the fact that we have no control over how they are stored or handled after delivery, Bliss-B Desserts does not accept exchanges or returns. All sales are final.</>,
      <>
        If your order arrives damaged or isn&apos;t what you ordered, contact us right away at{" "}
        <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
          blissbdesserts@gmail.com
        </a>{" "}
        with a photo — we&apos;ll make it right.
      </>,
    ],
  },
  {
    Icon: RefreshCw,
    title: "Cancellations & Changes",
    items: [
      <>To cancel or modify an order, please contact us through our website&apos;s Contact section. We will do our best to accommodate your request and provide a positive experience.</>,
      <>All cancellations must be made at least 3 business days prior to the scheduled pick-up or shipping date. Once the preparation of your order has begun, no changes, modifications, or cancellations can be made.</>,
    ],
  },
];

function PolicyColumn({ sections }: { sections: PolicySection[] }) {
  return (
    <Accordion type="multiple" className="space-y-4">
      {sections.map(({ Icon, title, items }) => (
        <AccordionItem
          key={title}
          value={title}
          className="rounded-2xl border border-brand-border bg-white px-6 shadow-sm"
        >
          <AccordionTrigger className="items-center py-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-brand-brown flex-shrink-0" aria-hidden="true" />
              <h2 className="text-lg md:text-xl font-bold text-brand-text">{title}</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4 text-brand-muted pt-2">
              {items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function PoliciesPage() {
  const midpoint = Math.ceil(POLICY_SECTIONS.length / 2);
  const leftColumn = POLICY_SECTIONS.slice(0, midpoint);
  const rightColumn = POLICY_SECTIONS.slice(midpoint);

  return (
    <div className="relative min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.6
          }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-4">
            Ordering, Delivery, and Pick-Up Policy
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            Everything you need to know about ordering, delivery, shipping, and picking up from Bliss-B Desserts
          </p>
        </motion.div>

        {/* Policy sections — two columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
        >
          <PolicyColumn sections={leftColumn} />
          <PolicyColumn sections={rightColumn} />
        </motion.div>

        {/* Still have questions? — same compact callout treatment as the
            address block on /contact, for visual consistency between pages. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand-brown bg-brand-brown/10 px-6 py-5"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <AlertCircle className="h-5 w-5 text-brand-brown flex-shrink-0 hidden sm:block" strokeWidth={1.75} aria-hidden="true" />
            <div>
              <p className="font-medium text-brand-text">Still have questions?</p>
              <p className="text-sm text-brand-muted">
                Call{" "}
                <a href="tel:+14708835035" className="text-brand-brown hover:underline">
                  470-883-5035
                </a>{" "}
                or email{" "}
                <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
                  blissbdesserts@gmail.com
                </a>
              </p>
            </div>
          </div>
          <Link href="/contact" className="flex-shrink-0 text-sm font-medium text-brand-brown hover:underline">
            Contact us →
          </Link>
        </motion.div>
      </div>

      <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />
    </div>
  );
}
