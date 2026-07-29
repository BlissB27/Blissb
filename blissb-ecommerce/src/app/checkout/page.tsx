"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useDeliveryStore } from "@/store/deliveryStore";
import { useHydrated } from "@/hooks/useHydrated";
import { getFulfillmentOptions } from "@/lib/deliverySchedule";
import { DeliverySelector } from "@/components/DeliverySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CreditCard, Lock, X } from "lucide-react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { calculateProcessingFee } from "@/lib/orderFees";
import { getProductImageSrc } from "@/lib/productImage";
import { validateCoupon } from "@/lib/coupons";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const [isLoading, setIsLoading] = useState(true);

  const { items, getTotalPrice, getShippingInfo, getMinimumOrderInfo } = useCartStore();
  const { selectedType, address } = useDeliveryStore();

  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", phone: "" });
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showCanceledBanner, setShowCanceledBanner] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percentOff: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const subtotal = getTotalPrice();
  const shippingInfo = getShippingInfo();
  const orderInfo = getMinimumOrderInfo();
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percentOff / 100) * 100) / 100 : 0;
  const processingFee = calculateProcessingFee(subtotal - discountAmount + deliveryFee);
  const total = subtotal - discountAmount + deliveryFee + processingFee;

  const handleApplyCoupon = () => {
    const result = validateCoupon(couponInput);
    if (result.valid) {
      setAppliedCoupon({ code: couponInput.trim().toUpperCase(), percentOff: result.percentOff });
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponError("That code isn't valid.");
    }
  };

  const fulfillment = getFulfillmentOptions();

  // Same hydration-settle pattern already proven on the old order-confirmation page,
  // so a mid-flow refresh can't misread a persisted cart as empty and eject the customer.
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [hydrated]);

  useEffect(() => {
    if (searchParams.get("canceled") === "1") {
      setShowCanceledBanner(true);
      router.replace("/checkout");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (isLoading) return;
    if (items.length === 0) {
      router.push("/");
    }
  }, [isLoading, items.length, router]);

  const isDeliveryValid = selectedType !== "delivery" || address.trim().length >= 8;

  const validateForm = () => {
    const errors: string[] = [];
    if (!customerInfo.name.trim()) errors.push("Name is required");
    if (!customerInfo.email.trim()) errors.push("Email is required");
    if (!customerInfo.phone.trim()) errors.push("Phone is required");
    if (selectedType === "delivery" && address.trim().length < 8) {
      errors.push("A complete delivery address is required");
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return; // reentrancy guard
    if (!validateForm()) return;

    isSubmittingRef.current = true;
    setIsProcessing(true);
    setValidationErrors([]);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const window = selectedType !== "shipping" ? fulfillment[selectedType] : null;
      const deliveryInfo = {
        type: selectedType,
        address: selectedType === "delivery" ? address : "",
        date: window?.date ?? "",
        time: window?.window ?? "",
        fee: deliveryFee,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customerInfo, deliveryInfo, couponCode: appliedCoupon?.code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationErrors([data.error ?? "Something went wrong. Please try again."]);
        return;
      }

      const { sessionId } = data;
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        setValidationErrors([result.error.message ?? "Payment failed"]);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setValidationErrors(["Something went wrong. Please try again."]);
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // redirecting
  }

  const canSubmit = orderInfo.hasMinimumOrder && isDeliveryValid && !isProcessing;

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-brand-brown">Checkout</h1>
        </motion.div>

        {showCanceledBanner && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Payment wasn&apos;t completed — nothing was charged. You can try again below.
                </p>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setShowCanceledBanner(false)}
                className="text-yellow-800 hover:text-yellow-900 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        )}

        {!orderInfo.hasMinimumOrder && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="p-4 text-sm text-yellow-800">
              Your cart subtotal must be at least ${orderInfo.minimumRequired.toFixed(2)} to check out
              (currently ${orderInfo.currentTotal.toFixed(2)}).
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {validationErrors.length > 0 && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Please fix the following:</span>
                    </div>
                    <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 1. Delivery method */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-brand-brown mb-4">1. Delivery Method</h2>
                  <DeliverySelector
                    subtotal={subtotal}
                    shippingCost={shippingInfo.shippingCost}
                    onDeliveryFeeChange={setDeliveryFee}
                  />
                </CardContent>
              </Card>

              {/* 2. Contact information */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-brand-brown mb-4">2. Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-brand-text font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1 border-brand-border focus:border-brand-brown"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-brand-text font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1 border-brand-border focus:border-brand-brown"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-brand-text font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1 border-brand-border focus:border-brand-brown"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  {selectedType === "shipping" && (
                    <p className="text-xs text-brand-muted mt-4">
                      You&apos;ll enter your shipping address on the next (secure Stripe) screen.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 3. Payment */}
              <Card className="bg-white border-brand-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-brand-brown" />
                    <h2 className="text-lg font-semibold text-brand-brown">3. Payment</h2>
                    <Lock className="w-4 h-4 text-brand-muted" />
                  </div>
                  <p className="text-sm text-brand-muted mb-4">
                    You&apos;ll be redirected to Stripe, our secure payment provider, to complete your payment.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <Lock className="w-3 h-3" />
                    <span>Secure checkout powered by Stripe</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-brand-success hover:bg-brand-success-hover text-white py-3 font-medium text-lg"
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

              <p className="text-xs text-brand-muted text-center">
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
            <Card className="bg-white border-brand-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-brand-brown mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-brand-bg rounded-lg overflow-hidden">
                          <img
                            src={getProductImageSrc(item.product.image)}
                            alt={item.product.name}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-brand-text text-sm">{item.product.name}</h4>
                        {item.flavor && <p className="text-xs text-brand-muted">Flavor: {item.flavor}</p>}
                        {item.boxFlavors && item.boxFlavors.length > 0 && (
                          <p className="text-xs text-brand-muted">
                            Flavors: {item.boxFlavors.map((f) => `${f.flavor} x${f.quantity}`).join(", ")}
                          </p>
                        )}
                        {item.customMessage && (
                          <p className="text-xs text-brand-success italic">&quot;{item.customMessage}&quot;</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-text">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Discount code */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-lg bg-brand-success/10 px-3 py-2 text-sm text-brand-success">
                      <span className="font-medium">{appliedCoupon.code} applied — {appliedCoupon.percentOff}% off</span>
                      <button
                        type="button"
                        onClick={() => { setAppliedCoupon(null); setCouponInput(""); }}
                        aria-label="Remove discount code"
                        className="text-brand-success hover:text-brand-success-hover"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <Input
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                          placeholder="Discount code"
                          className="border-brand-border focus:border-brand-brown"
                        />
                        <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                          Apply
                        </Button>
                      </div>
                      {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-brand-muted">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-brand-success">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-muted">
                    <span>{selectedType === "shipping" ? "Shipping" : selectedType === "delivery" ? "Delivery" : "Pickup"}</span>
                    <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "Free"}</span>
                  </div>
                  <div className="flex justify-between text-brand-muted">
                    <span>Card processing fee (2.9% + $0.80)</span>
                    <span>${processingFee.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-brand-text">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-brand-bg border border-brand-border rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-brown flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-brand-muted">
                      <strong>Allergy Notice:</strong> All products may contain tree nuts and food allergens.
                      See our{" "}
                      <a href="/allergens" className="underline hover:text-brand-brown">
                        allergen information
                      </a>{" "}
                      for full details.
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-muted">Loading your order...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
