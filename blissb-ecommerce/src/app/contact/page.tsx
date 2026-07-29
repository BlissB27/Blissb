"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageCircle, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { FAQ } from "@/components/Faq";

const EMAIL = "blissbdesserts@gmail.com";
const PHONE_DISPLAY = "+1 (470) 883-5035";
const PHONE_HREF = "+14708835035";

const CATERING_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Catering Quote Request"
)}&body=${encodeURIComponent(
  "Hi Bliss-B Desserts,\n\nI'd like a catering quote for:\n\nEvent date:\nGuest count:\nBudget range:\nEvent type:\n\nThanks!"
)}`;

const GENERAL_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Question from the website")}`;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-4">
            Contact Us
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have questions about our products,
            need help with an order, or want to discuss catering options, reach out any way that&apos;s easiest for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-brand-text mb-8">
              Get in Touch
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text mb-1">Email</h3>
                      <p className="text-brand-muted mb-2">Send us an email anytime</p>
                      <a href={`mailto:${EMAIL}`} className="text-brand-brown hover:underline font-medium">
                        {EMAIL}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text mb-1">Phone</h3>
                      <p className="text-brand-muted mb-2">Call or text us during business hours</p>
                      <a href={`tel:${PHONE_HREF}`} className="text-brand-brown hover:underline font-medium">
                        {PHONE_DISPLAY}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text mb-1">Location</h3>
                      <address className="text-brand-brown not-italic">
                        Braselton, GA <br />
                        United States
                      </address>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text mb-1">Business Hours</h3>
                      <div className="text-brand-muted space-y-1">
                        <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                        <p>Saturday: 10:00 AM - 6:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Right Column - Direct contact actions (no form to fill out and wait on) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-brand-text mb-8">
              Reach Us Directly
            </h2>

            <div className="space-y-4">
              <a href={GENERAL_MAILTO} className="block">
                <Card className="bg-white border-brand-border hover:border-brand-brown transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text">Email Us</h3>
                      <p className="text-sm text-brand-muted">Opens your email app, ready to send</p>
                    </div>
                  </CardContent>
                </Card>
              </a>

              <a href={`tel:${PHONE_HREF}`} className="block">
                <Card className="bg-white border-brand-border hover:border-brand-brown transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text">Call or Text Us</h3>
                      <p className="text-sm text-brand-muted">{PHONE_DISPLAY}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>

              <a href="https://instagram.com/blissb.bakery" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="bg-white border-brand-border hover:border-brand-brown transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-brown rounded-full flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text">DM Us on Instagram</h3>
                      <p className="text-sm text-brand-muted">@blissb.bakery</p>
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* Catering/corporate leads - the highest-value inquiries get a dedicated, structured CTA */}
              <a href={CATERING_MAILTO} className="block">
                <Card className="bg-brand-brown border-brand-brown hover:bg-brand-brown-hover transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Request a Catering Quote</h3>
                      <p className="text-sm text-white/80">
                        Planning an event? Get a pre-filled email template — event date, guest count, and budget.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>

            <p className="text-xs text-brand-muted text-center mt-6">
              We typically respond within 24 hours during business days.
            </p>
          </motion.div>
        </div>

        <div className="text-center mt-16 mb-[-2rem]">
          <p className="text-brand-muted">
            For full details, see our{" "}
            <a href="/policies" className="underline hover:text-brand-brown">
              shipping, delivery &amp; pickup policy
            </a>.
          </p>
        </div>
      </div>

      {/* Shared FAQ — same source as the homepage, so answers never drift between pages */}
      <FAQ withWaveDivider={false} />
    </div>
  );
}
