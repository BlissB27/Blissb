"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useDeliveryStore } from "@/store/deliveryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { calculateProcessingFee } from "@/lib/orderFees";
import { getProductImageSrc } from "@/lib/productImage";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getShippingInfo, getMinimumOrderInfo } = useCartStore();
  const {
    selectedType,
    selectedDate,
    selectedTime,
    selectedZipCode,
    isValidSelection,
    getDeliveryFee
  } = useDeliveryStore();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const subtotal = getTotalPrice();
  const shippingInfo = getShippingInfo();
  const orderInfo = getMinimumOrderInfo();

  // Calculate delivery fee based on selected type
  const getDeliveryFeeForType = () => {
    if (selectedType === 'shipping') {
      return shippingInfo.shippingCost;
    } else if (selectedType === 'delivery') {
      return getDeliveryFee(selectedZipCode);
    } else if (selectedType === 'pickup') {
      return 0;
    }
    return 0;
  };

  const deliveryFee = getDeliveryFeeForType();
  const processingFee = calculateProcessingFee(subtotal + deliveryFee);
  const total = subtotal + deliveryFee + processingFee;

  // Redirect if cart is empty, order below minimum, or delivery not selected
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
      return;
    }
    if (!orderInfo.hasMinimumOrder || !isValidSelection()) {
      router.push('/order-confirmation');
      return;
    }
  }, [items.length, orderInfo.hasMinimumOrder, isValidSelection, router]);

  const validateForm = () => {
    const errors: string[] = [];

    // Información de contacto siempre requerida
    if (!customerInfo.name.trim()) errors.push('Name is required');
    if (!customerInfo.email.trim()) errors.push('Email is required');
    if (!customerInfo.phone.trim()) errors.push('Phone is required');

    // Dirección solo requerida para shipping y delivery
    if (selectedType === 'shipping' || selectedType === 'delivery') {
      if (!customerInfo.address.trim()) errors.push('Address is required');
      if (!customerInfo.city.trim()) errors.push('City is required');
      if (!customerInfo.state.trim()) errors.push('State is required');
      if (!customerInfo.zipCode.trim()) errors.push('ZIP code is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Prepare delivery info
      const deliveryInfo = {
        type: selectedType,
        date: selectedDate,
        time: selectedTime,
        zipCode: selectedZipCode,
        address: selectedType !== 'pickup' ? customerInfo.address : '',
        fee: deliveryFee
      };

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo,
          deliveryInfo
        }),
      });

      const { sessionId } = await response.json();

      // Store payment session before redirect
      sessionStorage.setItem('stripe_session_id', sessionId);
      sessionStorage.setItem('payment_in_progress', 'true');

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        console.error('Stripe error:', result.error.message);
        setValidationErrors([result.error.message || 'Payment failed']);
        // Clear session storage on error
        sessionStorage.removeItem('stripe_session_id');
        sessionStorage.removeItem('payment_in_progress');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setValidationErrors(['Something went wrong. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#F8F4F0]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/order-confirmation"
            className="inline-flex items-center gap-2 text-[#8F4B2B] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to order confirmation
          </Link>
          <h1 className="text-3xl font-bold text-[#8F4B2B]">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Please fix the following errors:</span>
                    </div>
                    <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card className="bg-white border-[#E6D7CB]">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[#8F4B2B] mb-4">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-[#3B2A22] font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#3B2A22] font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-[#3B2A22] font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information (only for shipping/delivery) */}
              {(selectedType === 'shipping' || selectedType === 'delivery') && (
                <Card className="bg-white border-[#E6D7CB]">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-[#8F4B2B] mb-4">
                      {selectedType === 'shipping' ? 'Shipping' : 'Delivery'} Address
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address" className="text-[#3B2A22] font-medium">
                          Street Address *
                        </Label>
                        <Input
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                          placeholder="Enter your address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-[#3B2A22] font-medium">
                            City *
                          </Label>
                          <Input
                            id="city"
                            value={customerInfo.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                            placeholder="Enter city"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="state" className="text-[#3B2A22] font-medium">
                            State *
                          </Label>
                          <Input
                            id="state"
                            value={customerInfo.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                            placeholder="Enter state"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="zipCode" className="text-[#3B2A22] font-medium">
                          ZIP Code *
                        </Label>
                        <Input
                          id="zipCode"
                          value={customerInfo.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="mt-1 border-[#E6D7CB] focus:border-[#8F4B2B]"
                          placeholder="Enter ZIP code"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pickup Information Notice */}
              {selectedType === 'pickup' && (
                <Card className="bg-[#F0F8F0] border-[#1E7A31]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#1E7A31] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">🏪</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1E7A31] mb-2">Pickup Information</h3>
                        <div className="text-sm text-[#6E5B4E] space-y-1">
                          <p><strong>Location:</strong> Braselton, GA 30517</p>
                          <p><strong>Date & Time:</strong> {selectedDate} at {selectedTime}</p>
                          <p><strong>Note:</strong>We'll contact you for more details and please bring a valid ID for pickup verification.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Information */}
              <Card className="bg-white border-[#E6D7CB]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-[#8F4B2B]" />
                    <h2 className="text-lg font-semibold text-[#8F4B2B]">
                      Payment
                    </h2>
                    <Lock className="w-4 h-4 text-[#6E5B4E]" />
                  </div>

                  <p className="text-sm text-[#6E5B4E] mb-4">
                    Your payment information will be securely processed by Stripe.
                    You'll be redirected to complete your payment.
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#6E5B4E]">
                    <Lock className="w-3 h-3" />
                    <span>Secured by 256-bit SSL encryption</span>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing || !orderInfo.hasMinimumOrder}
                className="w-full bg-[#1E7A31] hover:bg-[#166728] text-white py-3 font-medium text-lg"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Complete Order - $${total.toFixed(2)}`
                )}
              </Button>

              <p className="text-xs text-[#6E5B4E] text-center">
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-8 lg:h-fit"
          >
            <Card className="bg-white border-[#E6D7CB]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#8F4B2B] mb-6">
                  Order Summary
                </h2>

                {/* Delivery Information */}
                <div className="bg-[#F8F4F0] rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-[#3B2A22] mb-2">
                    {selectedType === 'shipping' ? 'Shipping' : selectedType === 'delivery' ? 'Delivery' : 'Pickup'} Details
                  </h3>
                  <div className="text-sm text-[#6E5B4E] space-y-1">
                    {selectedType === 'shipping' && (
                      <p>Nationwide shipping (3-5 business days)</p>
                    )}
                    {(selectedType === 'delivery' || selectedType === 'pickup') && (
                      <>
                        <p>{selectedDate} at {selectedTime}</p>
                        {selectedType === 'delivery' && selectedZipCode && (
                          <p>ZIP Code: {selectedZipCode}</p>
                        )}
                        {selectedType === 'pickup' && (
                          <p>Braselton, GA, 30517</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-[#F8F4F0] rounded-lg overflow-hidden">
                          <img
                            src={getProductImageSrc(item.product.image)}
                            alt={item.product.name}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <span className="absolute -top-2 -right-2 bg-[#8F4B2B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-[#3B2A22] text-sm">
                          {item.product.name}
                        </h4>
                        {item.flavor && (
                          <p className="text-xs text-[#6E5B4E]">
                            Flavor: {item.flavor}
                          </p>
                        )}
                        {item.boxFlavors && item.boxFlavors.length > 0 && (
                          <p className="text-xs text-[#6E5B4E]">
                            Flavors: {item.boxFlavors.map(f => `${f.flavor} x${f.quantity}`).join(', ')}
                          </p>
                        )}
                        {item.customMessage && (
                          <p className="text-xs text-[#1E7A31] italic">
                            "{item.customMessage}"
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[#3B2A22]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[#6E5B4E]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#6E5B4E]">
                    <span>
                      {selectedType === 'shipping' ? 'Shipping' : selectedType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                    <span>
                      {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#6E5B4E]">
                    <span>Fees</span>
                    <span>${processingFee.toFixed(2)}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between text-lg font-bold text-[#3B2A22]">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Allergy Warning */}
                <div className="mt-6 p-3 bg-[#FFF9F5] border border-[#E6D7CB] rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#8F4B2B] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#6E5B4E]">
                      <strong>Allergy Notice:</strong> All products may contain tree nuts and food allergens.
                      Please visit our allergens info page for full details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
