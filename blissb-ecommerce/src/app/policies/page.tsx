"use client";

import { motion } from "framer-motion";
import { Package, MapPin, Truck, Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">
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

        {/* Ordering Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white border-brand-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text">
                  Ordering Schedule
                </h2>
              </div>

              <ul className="space-y-4 text-brand-muted">
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    <strong className="text-brand-text">Monday:</strong> shipping only (UPS). Local delivery and pickup aren&apos;t available on Mondays.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    <strong className="text-brand-text">Tuesday–Friday:</strong> online orders have a 2:00pm cutoff. Order before 2:00pm for same-day local delivery (2pm–6pm) or same-day pickup (6pm–8pm). Order after 2:00pm and it rolls to the next available day.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    <strong className="text-brand-text">Saturday:</strong> pickup only, at the Suwanee Farmers Market, 8am–12pm.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    The minimum order subtotal to check out is <strong className="text-brand-text">$20</strong>.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white border-brand-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text">
                  Local Delivery
                </h2>
              </div>

              <ul className="space-y-4 text-brand-muted">
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    We deliver within a <strong className="text-brand-text">25-mile radius</strong> of our bakery at 111 Manor Way, Braselton, GA 30517. Enter your address at checkout to see your exact delivery fee, calculated by real driving distance.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Delivery fees: <strong className="text-brand-text">free within 7 miles</strong>, $7 for 7.1–12 miles, $10 for 12.1–17 miles, and $15 for 17.1–25 miles.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Delivery is <strong className="text-brand-text">free on any order of $60 or more</strong>, regardless of distance, as long as it&apos;s within the 25-mile radius.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Beyond 25 miles, local delivery isn&apos;t available — please choose nationwide shipping or in-store pickup instead.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pick-Up Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white border-brand-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text">
                  Pick-Up Days and Policies
                </h2>
              </div>

              <ul className="space-y-4 text-brand-muted">
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    <strong className="text-brand-text">Tuesday–Friday:</strong> pickup at 111 Manor Way, Braselton, GA 30517, between 6pm–8pm (same-day if ordered before the 2:00pm cutoff).
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    <strong className="text-brand-text">Saturday:</strong> pickup only at the Suwanee Farmers Market, 8am–12pm.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    If you need to arrange a pick-up on a different day or time, please contact us at{" "}
                    <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
                      blissbdesserts@gmail.com
                    </a>{" "}
                    so we can work out a mutually convenient option.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Please note that orders not collected at the agreed-upon date and time will not qualify for a refund or store credit for a new order.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white border-brand-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text">
                  Shipping Days and Policies
                </h2>
              </div>

              <ul className="space-y-4 text-brand-muted">
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    We ship every Monday using UPS, exclusively within the United States.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Bliss-B Desserts is not liable for any delays in delivery due to errors or omissions in the shipping address provided by the customer. We also cannot be held responsible if a package, even if marked as &quot;delivered,&quot; is later reported lost.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    In cases where shipments are returned because of an incorrect or incomplete address, additional charges will apply for re-shipment.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Shipping fees are non-refundable if there are delays caused by inaccessible delivery sites or closed locations.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Please be aware that estimated delivery times do not account for unforeseen weather disruptions or delays due to high volume experienced by shipping carriers.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refund Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white border-brand-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text">
                  Refund, Exchange, or Return Policies
                </h2>
              </div>

              <ul className="space-y-4 text-brand-muted">
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    Due to the perishable nature of our products and the fact that we have no control over how they are stored or handled after delivery, Bliss-B Desserts does not accept exchanges or returns. All sales are final.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    If your order arrives damaged or isn&apos;t what you ordered, contact us right away at{" "}
                    <a href="mailto:blissbdesserts@gmail.com" className="text-brand-brown hover:underline">
                      blissbdesserts@gmail.com
                    </a>{" "}
                    with a photo — we&apos;ll make it right.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cancellations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white border-brand-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-brand-text">
                  Cancellations or Modifications
                </h2>
              </div>

              <ul className="space-y-4 text-brand-muted">
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    To cancel or modify an order, please contact us through our website&apos;s Contact section. We will do our best to accommodate your request and provide a positive experience.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-brown font-bold" aria-hidden="true">•</span>
                  <p>
                    All cancellations must be made at least 3 business days prior to the scheduled pick-up or shipping date. Once the preparation of your order has begun, no changes, modifications, or cancellations can be made.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-brand-brown border-brand-brown shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 text-white">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-medium mb-2">
                    Thank you for choosing Bliss-B Desserts!
                  </p>
                  <p className="text-sm text-white/90">
                    If you have any questions about our policy, please don&apos;t hesitate to contact us at{" "}
                    <a href="tel:+14708835035" className="underline hover:text-brand-accent">
                      470-883-5035
                    </a>{" "}
                    or via email at{" "}
                    <a href="mailto:blissbdesserts@gmail.com" className="underline hover:text-brand-accent">
                      blissbdesserts@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
