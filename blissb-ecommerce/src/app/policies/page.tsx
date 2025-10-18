"use client";

import { motion } from "framer-motion";
import { Package, MapPin, Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#F8F4F0]">
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
          <h1 className="text-4xl md:text-5xl font-bold text-[#8F4B2B] mb-4">
            Shipping and Pick-Up Policy
          </h1>
          <p className="text-[#6E5B4E] max-w-2xl mx-auto">
            Everything you need to know about ordering, shipping, and picking up from Bliss-B Bakery
          </p>
        </motion.div>

        {/* Pick-Up Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.2,
            duration: 0.6
          }}
          className="mb-8"
        >
          <Card className="bg-white border-[#E6D7CB] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#3B2A22]">
                  Pick-Up Days and Policies
                </h2>
              </div>

              <div className="space-y-4 text-[#6E5B4E]">
                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    <strong className="text-[#3B2A22]">Pick-Up Location:</strong> 111 Manor Way, Braselton, GA 30517.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    If you need to arrange a pick-up on a different day or time, please contact us at{" "}
                    <a href="mailto:blissBdesserts@gmail.com" className="text-[#8F4B2B] hover:underline">
                      blissBdesserts@gmail.com
                    </a>{" "}
                    so we can work out a mutually convenient option.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    Please note that orders not collected at the agreed-upon date and time will not qualify for a refund or store credit for a new order.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.3,
            duration: 0.6
          }}
          className="mb-8"
        >
          <Card className="bg-white border-[#E6D7CB] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#3B2A22]">
                  Shipping Days and Policies
                </h2>
              </div>

              <div className="space-y-4 text-[#6E5B4E]">
                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    We ship every Monday using UPS, exclusively within the United States.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    Bliss-B Bakery is not liable for any delays in delivery due to errors or omissions in the shipping address provided by the customer. We also cannot be held responsible if a package, even if marked as "delivered," is later reported lost.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    In cases where shipments are returned because of an incorrect or incomplete address, additional charges will apply for re-shipment.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    Shipping fees are non-refundable if there are delays caused by inaccessible delivery sites or closed locations.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    Please be aware that estimated delivery times do not account for unforeseen weather disruptions or delays due to high volume experienced by shipping carriers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Refund Policy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.4,
            duration: 0.6
          }}
          className="mb-8"
        >
          <Card className="bg-white border-[#E6D7CB] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#3B2A22]">
                  Refund, Exchange, or Return Policies
                </h2>
              </div>

              <div className="space-y-4 text-[#6E5B4E]">
                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    Due to the perishable nature of our products and the fact that we have no control over how they are stored or handled after delivery, Bliss-B Bakery does not accept exchanges or returns. All sales are final.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cancellations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.5,
            duration: 0.6
          }}
          className="mb-8"
        >
          <Card className="bg-white border-[#E6D7CB] shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#3B2A22]">
                  Cancellations or Modifications
                </h2>
              </div>

              <div className="space-y-4 text-[#6E5B4E]">
                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    To cancel or modify an order, please contact us through our website's Contact section. We will do our best to accommodate your request and provide a positive experience.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-[#8F4B2B] font-bold">•</span>
                  <p>
                    All cancellations must be made at least 3 business days prior to the scheduled pick-up or shipping date. Once the preparation of your order has begun, no changes, modifications, or cancellations can be made.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.6,
            duration: 0.6
          }}
        >
          <Card className="bg-[#8F4B2B] border-[#8F4B2B] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 text-white">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium mb-2">
                    Thank you for choosing Bliss-B Bakery!
                  </p>
                  <p className="text-sm text-white/90">
                    If you have any questions about our policy, please don't hesitate to contact us at{" "}
                    <a href="tel:+14708835035" className="underline hover:text-[#EFC596]">
                      470-883-5035
                    </a>{" "}
                    or via email at{" "}
                    <a href="mailto:blissbdesserts@gmail.com" className="underline hover:text-[#EFC596]">
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
