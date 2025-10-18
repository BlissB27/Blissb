"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F4F0]">
      <div className="max-w-6xl mx-auto px-4 py-16">
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
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.2,
              duration: 0.6
            }}
            className="text-4xl md:text-5xl font-bold text-[#8F4B2B] mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.4,
              duration: 0.6
            }}
            className="text-[#6E5B4E] max-w-2xl mx-auto"
          >
            We'd love to hear from you! Whether you have questions about our products,
            need help with an order, or want to discuss catering options, we're here to help.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.6,
              duration: 0.6
            }}
          >
            <h2 className="text-2xl font-bold text-[#3B2A22] mb-8">
              Get in Touch
            </h2>
            
            <div className="space-y-6 mb-8">
              {/* Email */}
              <Card className="bg-white border-[#E6D7CB]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3B2A22] mb-1">Email</h3>
                      <p className="text-[#6E5B4E] mb-2">Send us an email anytime</p>
                      <a 
                        href="mailto:hello@bliss-b.com" 
                        className="text-[#8F4B2B] hover:underline font-medium"
                      >
                        blissbdesserts@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="bg-white border-[#E6D7CB]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3B2A22] mb-1">Phone</h3>
                      <p className="text-[#6E5B4E] mb-2">Call us during business hours</p>
                      <a 
                        href="tel:+15551234567" 
                        className="text-[#8F4B2B] hover:underline font-medium"
                      >
                        +1 (470) 883-5035
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-white border-[#E6D7CB]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3B2A22] mb-1">Location</h3>
                      
                      <address className="text-[#8F4B2B] not-italic">
                        Braselton, GA <br />
                        United States
                      </address>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="bg-white border-[#E6D7CB]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#8F4B2B] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3B2A22] mb-1">Business Hours</h3>
                      <div className="text-[#6E5B4E] space-y-1">
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

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              delay: 0.8,
              duration: 0.6
            }}
          >
            <Card className="bg-white border-[#E6D7CB]">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#3B2A22] mb-6">
                  Send us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#1E7A31] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1E7A31] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[#6E5B4E]">
                      Thank you for reaching out. We'll get back to you soon!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-[#3B2A22] font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-[#3B2A22] font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-[#3B2A22] font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject" className="text-[#3B2A22] font-medium">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                        placeholder="e.g., Order inquiry, Catering request, General question"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-[#3B2A22] font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B] min-h-[120px]"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#8F4B2B] hover:bg-[#6f3a22] text-white font-medium py-3"
                      size="lg"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-xs text-[#6E5B4E] text-center">
                      We typically respond within 24 hours during business days.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay: 0.2,
            duration: 0.6
          }}
          className="mt-16"
        >
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
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-[#8F4B2B] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#6E5B4E]">
              Quick answers to common questions. For more detailed FAQs, visit our main FAQ section.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-[#E6D7CB]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#3B2A22] mb-2">
                  When will my order ship?
                </h3>
                <p className="text-[#6E5B4E] text-sm">
                  We ship every Monday to ensure freshness and quality. Make sure to place your order before the shipping cutoff to get it in time!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E6D7CB]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#3B2A22] mb-2">
                  Can I pick up my order?
                </h3>
                <p className="text-[#6E5B4E] text-sm">
                  Yes! Pickup is available in Braselton, GA 30517. Once your order is confirmed, you'll receive pickup instructions by email.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E6D7CB]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#3B2A22] mb-2">
                  Do you offer catering for events?
                </h3>
                <p className="text-[#6E5B4E] text-sm">
                  Absolutely! We cater for weddings, business events, birthdays, baby showers, and more. Fill out the Catering Request Form on our website at least 2 weeks before your event.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E6D7CB]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#3B2A22] mb-2">
                  Do your products contain allergens?
                </h3>
                <p className="text-[#6E5B4E] text-sm">
                  Our desserts are made with ingredients like wheat, dairy, eggs, soy, and nuts. While we do our best to avoid cross-contamination, all items are made in the same kitchen using shared equipment.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  );
}