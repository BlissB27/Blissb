"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useDeliveryStore } from '@/store/deliveryStore';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  const { resetDelivery } = useDeliveryStore();
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const paymentInProgress = sessionStorage.getItem('payment_in_progress');
    const storedSessionId = sessionStorage.getItem('stripe_session_id');

    // Solo limpiar si realmente viene de un pago exitoso
    if (sessionId && (paymentInProgress === 'true' || storedSessionId === sessionId)) {
      // Generar número de orden basado en session ID
      const orderNum = `BLISS-${sessionId.slice(-8).toUpperCase()}`;
      setOrderNumber(orderNum);

      // Limpiar carrito y delivery info
      clearCart();
      resetDelivery();

      // Limpiar session storage
      sessionStorage.removeItem('payment_in_progress');
      sessionStorage.removeItem('stripe_session_id');
    } else if (sessionId) {
      // Si hay sessionId pero no hay evidencia de pago, solo mostrar el número de orden
      const orderNum = `BLISS-${sessionId.slice(-8).toUpperCase()}`;
      setOrderNumber(orderNum);
    }
  }, [sessionId, clearCart, resetDelivery]);

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex items-center justify-center p-4">
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
        <Card className="bg-white border-[#E6D7CB] shadow-lg">
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
              className="w-20 h-20 bg-[#1E7A31] rounded-full flex items-center justify-center mx-auto mb-6"
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
              className="text-3xl md:text-4xl font-bold text-[#1E7A31] mb-4"
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
              <p className="text-lg text-[#6E5B4E]">
                Thank you for your order! Your sweet treats are on their way.
              </p>

              {orderNumber && (
                <div className="bg-[#F8F4F0] rounded-lg p-4">
                  <p className="text-sm text-[#6E5B4E] mb-1">Order Number:</p>
                  <p className="text-xl font-bold text-[#8F4B2B]">{orderNumber}</p>
                </div>
              )}

              <div className="text-sm text-[#6E5B4E] space-y-2">
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
              className="border-t border-[#E6D7CB] pt-6 mb-6"
            >
              <h3 className="font-semibold text-[#3B2A22] mb-4">
                What's Next?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-[#F8F4F0] rounded-lg">
                  <Mail className="w-5 h-5 text-[#8F4B2B] flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-[#3B2A22]">Check Your Email</p>
                    <p className="text-[#6E5B4E]">
                      Order confirmation and tracking details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#F8F4F0] rounded-lg">
                  <Phone className="w-5 h-5 text-[#8F4B2B] flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-[#3B2A22]">Questions?</p>
                    <p className="text-[#6E5B4E]">
                      Contact us at (555) 123-4567
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
                className="border-[#8F4B2B] text-[#8F4B2B] hover:bg-[#8F4B2B] hover:text-white"
              >
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>

              <Button
                asChild
                className="bg-[#8F4B2B] hover:bg-[#6f3a22] text-white"
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
              className="mt-8 p-4 bg-[#FFF9F5] rounded-lg border border-[#E6D7CB]"
            >
              <p className="text-xs text-[#6E5B4E]">
                <strong>Allergy Notice:</strong> All products may contain tree nuts and food allergens.
                Please visit our allergens info page for full details.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}