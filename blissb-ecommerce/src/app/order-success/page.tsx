"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useDeliveryStore } from '@/store/deliveryStore';
import { motion } from 'framer-motion';

type VerifyState = 'verifying' | 'confirmed' | 'unconfirmed' | 'no-session';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  const { resetDelivery } = useDeliveryStore();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [status, setStatus] = useState<VerifyState>(sessionId ? 'verifying' : 'no-session');

  // Real server-side confirmation: ask Stripe directly whether this session actually
  // completed, instead of trusting a client-side flag that a canceled/abandoned
  // attempt could leave stale.
  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/verify-order?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data: { paid: boolean; orderNumber: string | null }) => {
        if (data.paid) {
          setOrderNumber(data.orderNumber ?? `BLISS-${sessionId.slice(-8).toUpperCase()}`);
          setStatus('confirmed');
          clearCart();
          resetDelivery();
        } else {
          setStatus('unconfirmed');
        }
      })
      .catch(() => setStatus('unconfirmed'));
  }, [sessionId, clearCart, resetDelivery]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto mb-4" />
          <p className="text-brand-muted">Confirming your order...</p>
        </div>
      </div>
    );
  }

  if (status === 'unconfirmed' || status === 'no-session') {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <Card className="bg-white border-brand-border shadow-lg max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-brand-text mb-4">
              We couldn&apos;t confirm this order
            </h1>
            <p className="text-brand-muted mb-6">
              {status === 'no-session'
                ? "We don't have a payment session to check. If you completed a payment, check your email for confirmation, or contact us if you were charged."
                : "This order hasn't been confirmed as paid. If you completed a payment, check your email for confirmation, or contact us if you were charged."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild className="bg-brand-brown hover:bg-brand-brown-hover text-white">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.6
        }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-white border-brand-border shadow-lg">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 300,
                delay: 0.3,
                duration: 0.5
              }}
              className="w-20 h-20 bg-brand-success rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.5,
                duration: 0.6
              }}
              className="text-3xl md:text-4xl font-bold text-brand-success mb-4"
            >
              Order Confirmed!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.7,
                duration: 0.6
              }}
              className="space-y-4 mb-8"
            >
              <p className="text-lg text-brand-muted">
                Thank you for your order! Your sweet treats are on their way.
              </p>

              {orderNumber && (
                <div className="bg-brand-bg rounded-lg p-4">
                  <p className="text-sm text-brand-muted mb-1">Order Number:</p>
                  <p className="text-xl font-bold text-brand-brown">{orderNumber}</p>
                </div>
              )}

              <div className="text-sm text-brand-muted space-y-2">
                <p>
                  A confirmation email has been sent to your email address with all the order details.
                </p>
                <p>
                  We'll notify you when your order is ready for pickup or has been shipped.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 0.9,
                duration: 0.6
              }}
              className="border-t border-brand-border pt-6 mb-6"
            >
              <h3 className="font-semibold text-brand-text mb-4">
                What's Next?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-brand-bg rounded-lg">
                  <Mail className="w-5 h-5 text-brand-brown flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-brand-text">Check Your Email</p>
                    <p className="text-brand-muted">
                      Order confirmation and tracking details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-bg rounded-lg">
                  <Phone className="w-5 h-5 text-brand-brown flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-brand-text">Questions?</p>
                    <p className="text-brand-muted">
                      Contact us at +1 (470) 883-5035
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                delay: 1.1,
                duration: 0.6
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                variant="outline"
                className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
              >
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>

              <Button
                asChild
                className="bg-brand-brown hover:bg-brand-brown-hover text-white"
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.3,
                duration: 0.6
              }}
              className="mt-8 p-4 bg-brand-bg rounded-lg border border-brand-border"
            >
              <p className="text-xs text-brand-muted">
                <strong>Allergy Notice:</strong> All products may contain tree nuts and food allergens.
                Please visit our{" "}
                <Link href="/allergens" className="underline hover:text-brand-brown">
                  allergen information
                </Link>{" "}
                page for full details.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown mx-auto mb-4"></div>
          <p className="text-brand-muted">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}