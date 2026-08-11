'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore, type CartItem, type AppliedCoupon } from '@/store/cartStore';
import { useDeliveryStore, type ShippingAddress } from '@/store/deliveryStore';
import { useHydrated } from '@/hooks/useHydrated';
import { getFulfillmentOptions } from '@/lib/deliverySchedule';
import { DeliverySelector } from '@/components/DeliverySelector';
import { AddressFields } from '@/components/AddressFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup, GroupField } from '@/components/ui/field-group';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, ChevronDown, Lock } from 'lucide-react';
import { calculateProcessingFee } from '@/lib/orderFees';
import { getProductImageSrc } from '@/lib/productImage';
import { toSentenceCase } from '@/lib/text';
import { isAddressComplete, joinAddress } from '@/lib/address';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function emailLooksValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function nameLooksValid(name: string) {
  const trimmed = name.trim();
  // Letters (incl. accented), spaces, hyphens, apostrophes, periods — rejects
  // names that are just digits/symbols without being overly strict about format.
  return trimmed.length >= 2 && /^[\p{L}][\p{L}'.\- ]*$/u.test(trimmed);
}

// Formats digits as the user types into (404) 952-7610 — US phone numbers only.
function formatPhoneNumber(value: string) {
  let digits = value.replace(/\D/g, '');
  // Browser autofill often includes the +1 country code (e.g. "+1 (404) 952-7610"),
  // which would otherwise shift every digit and drop the real last one.
  if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function phoneDigitCount(value: string) {
  return value.replace(/\D/g, '').length;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {children}
    </p>
  );
}

function InlineErrorBanner({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 ${className}`}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

type CheckoutRequestBody = {
  items: CartItem[];
  customerInfo: { name: string; email: string; phone: string };
  deliveryInfo: { type: string; address: string; date: string; time: string; fee: number };
  // Structured (street/city/state/zip), unlike deliveryInfo.address above (a
  // single joined line for Google Maps) — Stripe Tax needs a real postal_code.
  deliveryAddress: ShippingAddress | undefined;
  shippingAddress: ShippingAddress | undefined;
  billingAddress: ShippingAddress;
  couponCode: string | undefined;
};

// Lives inside <Elements>, which is now mounted immediately (deferred-intent
// pattern: no PaymentIntent needs to exist yet for the card form to render).
// The real PaymentIntent is only created right here, at the moment "Pay" is
// clicked — after everything else has been validated — so there's no
// separate "Continue to Payment" step, and no stale-intent bookkeeping to
// invalidate later, since every click creates a fresh one against current data.
function PaymentSection({
  total,
  onValidateAll,
  buildRequestBody,
  customerName,
  shippingForConfirm,
}: {
  total: number;
  onValidateAll: () => boolean;
  buildRequestBody: () => CheckoutRequestBody;
  customerName: string;
  shippingForConfirm:
    | { name: string; address: { line1: string; city?: string; state?: string; postal_code?: string; country: string } }
    | undefined;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [payState, setPayState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isAmountUpdating, setIsAmountUpdating] = useState(false);
  const isFirstAmount = useRef(true);

  // Keeps the estimated amount shown in the payment form (and in wallet UIs
  // like Apple Pay/Google Pay) in sync as delivery fee/coupon/etc. change —
  // this is only ever an estimate until the real PaymentIntent is created below.
  // The button shows a brief spinner on every change after the first mount so
  // switching fulfillment method visibly reflects the new total, not a silent jump.
  useEffect(() => {
    elements?.update({ amount: Math.round(total * 100) });
    if (isFirstAmount.current) {
      isFirstAmount.current = false;
      return;
    }
    setIsAmountUpdating(true);
    const timer = setTimeout(() => setIsAmountUpdating(false), 450);
    return () => clearTimeout(timer);
  }, [elements, total]);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setError(null);

    if (!onValidateAll()) return;

    setPayState('processing');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Please check your payment details.');
      setPayState('idle');
      return;
    }

    let clientSecret: string;
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildRequestBody()),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setPayState('idle');
        return;
      }
      clientSecret = data.clientSecret;
    } catch (requestError) {
      console.error('Error creating payment intent:', requestError);
      setError('Something went wrong. Please check your connection and try again.');
      setPayState('idle');
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
        payment_method_data: {
          billing_details: { name: customerName },
        },
        ...(shippingForConfirm ? { shipping: shippingForConfirm } : {}),
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.');
      setPayState('idle');
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      setPayState('success');
      // A brief beat on the success state before leaving the page, so the
      // confirmation actually registers instead of an instant redirect.
      setTimeout(() => {
        router.push(`/order-success?payment_intent=${paymentIntent.id}`);
      }, 900);
    } else {
      setPayState('idle');
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && <InlineErrorBanner>{error}</InlineErrorBanner>}
      <Button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || payState !== 'idle'}
        className="w-full bg-brand-success hover:bg-brand-success-hover text-white py-3 font-medium text-lg overflow-hidden"
        size="lg"
      >
        <AnimatePresence mode="wait" initial={false}>
          {payState === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
              Payment successful
            </motion.div>
          ) : payState === 'processing' ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : isAmountUpdating ? (
            <motion.div
              key="updating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {`Pay $${total.toFixed(2)}`}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      <p className="text-xs text-brand-muted text-center">
        By completing your order, you agree to our{' '}
        <Link href="/terms" target="_blank" className="text-brand-brown hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" target="_blank" className="text-brand-brown hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

// Big total + plain item list + breakdown — no card, no border, matching
// Stripe's own checkout where the "pay X" side is the quiet one and the form
// side is the elevated card. Shared between the desktop column and the
// mobile collapsible bar.
function OrderSummaryPanel({
  items,
  appliedCoupon,
  setCoupon,
  clearCoupon,
  subtotal,
  discountAmount,
  deliveryFee,
  taxAmount,
  processingFee,
  total,
  selectedType,
  isRecalculating,
}: {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon) => void;
  clearCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  processingFee: number;
  total: number;
  selectedType: 'shipping' | 'delivery' | 'pickup';
  isRecalculating: boolean;
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || isApplyingCoupon) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const result = await res.json();
      if (result.valid) {
        setCoupon({ code: couponInput.trim().toUpperCase(), percentOff: result.percentOff });
        setCouponInput('');
      } else {
        setCouponError(result.error ?? "That code isn't valid.");
      }
    } catch {
      setCouponError("Couldn't check that code right now. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div>
      {/* The logo file itself has built-in left padding before the "B" glyph
          starts, so a negative margin is needed to true it up with the text
          below it, which has none. */}
      <Link href="/" className="inline-block mb-6 -ml-5">
        <img src="/img/logobb.png" alt="Bliss-B Desserts" className="h-16 w-auto" />
      </Link>
      <p className="text-sm text-brand-muted mb-1">Pay</p>
      {isRecalculating ? (
        <Skeleton className="h-10 w-32 mb-8" />
      ) : (
        <p className="text-4xl font-bold text-brand-text mb-8">${total.toFixed(2)}</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white border border-brand-border rounded-lg overflow-hidden">
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-text truncate">{item.product.name}</p>
              {item.flavor && <p className="text-xs text-brand-muted">{toSentenceCase(item.flavor)}</p>}
              {item.boxFlavors && item.boxFlavors.length === 1 && (
                <p className="text-xs text-brand-muted">{toSentenceCase(item.boxFlavors[0].flavor)}</p>
              )}
              {item.boxFlavors && item.boxFlavors.length > 1 && (
                <p className="text-xs text-brand-muted">
                  {item.boxFlavors.map((f) => toSentenceCase(f.flavor)).join(', ')}
                </p>
              )}
              {item.message && (
                <p className="text-xs text-brand-muted italic truncate">Message: &ldquo;{item.message}&rdquo;</p>
              )}
            </div>
            <p className="text-sm font-medium text-brand-text flex-shrink-0">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {appliedCoupon ? (
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-bg border border-brand-border px-2 py-1 text-xs font-medium text-brand-text">
              🏷️ {appliedCoupon.code} · {appliedCoupon.percentOff}% off
            </span>
            <button
              type="button"
              onClick={clearCoupon}
              className="text-xs text-brand-muted hover:text-brand-text underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <Input
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                placeholder="Discount code"
                className="bg-white border-brand-border focus:border-brand-brown"
              />
              <Button type="button" onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponInput.trim()}>
                {isApplyingCoupon ? 'Checking…' : 'Apply'}
              </Button>
            </div>
            {couponError && <ErrorText>{couponError}</ErrorText>}
          </div>
        )}
      </div>

      <div className="border-t border-brand-border mt-6 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-brand-muted">
          <span>Subtotal</span>
          <span className="text-brand-text">${subtotal.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-brand-success">
            <span>Discount ({appliedCoupon.code})</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-brand-muted">
          <span>{selectedType === 'shipping' ? 'Shipping' : selectedType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
          {isRecalculating ? (
            <Skeleton className="h-4 w-14" />
          ) : (
            <span className="text-brand-text">{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
          )}
        </div>

        {taxAmount > 0 && (
          <div className="flex justify-between text-brand-muted">
            <span>Tax</span>
            <span className="text-brand-text">${taxAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between gap-4 text-brand-muted">
          <span>Card processing fee</span>
          {isRecalculating ? (
            <Skeleton className="h-4 w-12 flex-shrink-0" />
          ) : (
            <span className="flex-shrink-0 text-brand-text">${processingFee.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="border-t border-brand-border mt-4 pt-4 flex justify-between text-base font-bold text-brand-text">
        <span>Total due</span>
        {isRecalculating ? <Skeleton className="h-5 w-16" /> : <span>${total.toFixed(2)}</span>}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [isLoading, setIsLoading] = useState(true);

  const { items, getTotalPrice, getShippingInfo, getMinimumOrderInfo, appliedCoupon, setCoupon, clearCoupon } =
    useCartStore();
  const {
    selectedType,
    billingAddress,
    deliveryAddress,
    deliveryAddressSameAsBilling,
    shippingAddress,
    shippingAddressSameAsBilling,
    setBillingAddress,
  } = useDeliveryStore();

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [contactErrors, setContactErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  // Before the first "Pay" click, blur shouldn't nag about an untouched empty
  // field — only about content that's actually wrong (a malformed email, an
  // incomplete phone). After a submit attempt, blur enforces "required" too,
  // since the user has now tried to proceed.
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [isDeliveryQuoting, setIsDeliveryQuoting] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [isTaxQuoting, setIsTaxQuoting] = useState(false);
  // Días bloqueados por la dueña (Strapi) — el calendario de delivery/pickup los
  // salta. Vacío hasta que carga; si el endpoint falla, se queda vacío (sin bloqueos).
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const subtotal = getTotalPrice();
  const shippingInfo = getShippingInfo();
  const orderInfo = getMinimumOrderInfo();
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percentOff / 100) * 100) / 100 : 0;
  // Estimated client-side throughout — the real amount is only computed
  // server-side at the moment of payment (see PaymentSection.buildRequestBody).
  // taxAmount itself is a live preview from /api/tax-quote (below), mirroring
  // exactly how /api/checkout computes it, so this total matches what gets charged.
  const processingFee = calculateProcessingFee(subtotal - discountAmount + deliveryFee + taxAmount);
  const total = subtotal - discountAmount + deliveryFee + taxAmount + processingFee;

  const fulfillment = getFulfillmentOptions(new Date(), blockedDates);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [hydrated]);

  // Carga las fechas bloqueadas una vez al montar, para el cálculo de días de
  // delivery/pickup. Best-effort: si falla, el checkout sigue con las reglas fijas.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/blocked-dates')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.dates)) setBlockedDates(data.dates);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (items.length === 0) {
      router.push('/');
    }
  }, [isLoading, items.length, router]);

  // Billing is the one address always required, collected right after contact
  // info — Delivery/Shipping each default to it unless the customer says the
  // order goes somewhere different.
  const isBillingAddressValid = isAddressComplete(billingAddress);
  const effectiveDeliveryAddress = deliveryAddressSameAsBilling ? billingAddress : deliveryAddress;
  const effectiveShippingAddress = shippingAddressSameAsBilling ? billingAddress : shippingAddress;
  const isDeliveryValid = selectedType !== 'delivery' || isAddressComplete(effectiveDeliveryAddress);
  const isShippingAddressValid = selectedType !== 'shipping' || isAddressComplete(effectiveShippingAddress);

  // Live tax preview (see /api/tax-quote) — keeps the order summary, sticky
  // total, and the amount shown in the Payment Element / Apple Pay / Google Pay
  // sheet in sync with what /api/checkout will actually charge at "Pay" time.
  const itemsSignature = JSON.stringify(
    items.map((i) => ({ id: i.product.id, q: i.quantity, f: i.flavor, bf: i.boxFlavors })),
  );
  const taxReady =
    items.length > 0 &&
    (selectedType === 'pickup'
      ? isBillingAddressValid
      : selectedType === 'delivery'
        ? isDeliveryValid
        : isShippingAddressValid);

  useEffect(() => {
    if (!taxReady) {
      setTaxAmount(0);
      setIsTaxQuoting(false);
      return;
    }

    setIsTaxQuoting(true);
    const timer = setTimeout(() => {
      fetch('/api/tax-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          deliveryInfo: {
            type: selectedType,
            address: selectedType === 'delivery' ? joinAddress(effectiveDeliveryAddress) : '',
            fee: deliveryFee,
          },
          deliveryAddress: selectedType === 'delivery' ? effectiveDeliveryAddress : undefined,
          shippingAddress: selectedType === 'shipping' ? effectiveShippingAddress : undefined,
          billingAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => setTaxAmount(typeof data.taxAmount === 'number' ? data.taxAmount : 0))
        .catch(() => setTaxAmount(0))
        .finally(() => setIsTaxQuoting(false));
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    taxReady,
    itemsSignature,
    selectedType,
    deliveryFee,
    JSON.stringify(billingAddress),
    JSON.stringify(effectiveDeliveryAddress),
    JSON.stringify(effectiveShippingAddress),
  ]);

  const handleInputChange = (field: 'name' | 'email' | 'phone', value: string) => {
    const nextValue = field === 'phone' ? formatPhoneNumber(value) : value;
    setCustomerInfo((prev) => ({ ...prev, [field]: nextValue }));
    setContactErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validateContactField = (field: 'name' | 'email' | 'phone', value: string): string | undefined => {
    if (field === 'email') {
      if (!value.trim()) return 'Email is required';
      if (!emailLooksValid(value)) return 'Enter a valid email address';
    } else if (field === 'name') {
      if (!value.trim()) return 'Name is required';
      if (!nameLooksValid(value)) return 'Enter your full name';
    } else {
      if (!value.trim()) return 'Phone number is required';
      if (phoneDigitCount(value) !== 10) return 'Enter a complete 10-digit phone number';
    }
    return undefined;
  };

  const handleContactBlur = (field: 'name' | 'email' | 'phone') => {
    const value = customerInfo[field];
    if (!value.trim() && !hasAttemptedSubmit) {
      // Untouched empty field, no submit attempt yet — don't nag.
      return;
    }
    setContactErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }));
  };

  // Runs everything at once (rather than stopping at the first problem) so
  // the customer sees every field that needs fixing in one pass, not one at a time.
  const validateAll = (): boolean => {
    setHasAttemptedSubmit(true);

    const contactFieldErrors = {
      name: validateContactField('name', customerInfo.name),
      email: validateContactField('email', customerInfo.email),
      phone: validateContactField('phone', customerInfo.phone),
    };
    setContactErrors(contactFieldErrors);
    const contactOk = !Object.values(contactFieldErrors).some(Boolean);

    const billingOk = isBillingAddressValid;
    setBillingError(billingOk ? null : 'A complete billing address is required.');

    const deliveryErrs: string[] = [];
    if (selectedType === 'delivery' && !isDeliveryValid) deliveryErrs.push('A complete delivery address is required.');
    if (selectedType === 'shipping' && !isShippingAddressValid)
      deliveryErrs.push('A complete shipping address is required.');
    setDeliveryError(deliveryErrs.length > 0 ? deliveryErrs.join(' ') : null);

    return contactOk && billingOk && deliveryErrs.length === 0;
  };

  const buildRequestBody = (): CheckoutRequestBody => {
    const window_ = selectedType !== 'shipping' ? fulfillment[selectedType] : null;
    return {
      items,
      customerInfo,
      deliveryInfo: {
        type: selectedType,
        address: selectedType === 'delivery' ? joinAddress(effectiveDeliveryAddress) : '',
        date: window_?.date ?? '',
        time: window_?.window ?? '',
        fee: deliveryFee,
      },
      deliveryAddress: selectedType === 'delivery' ? effectiveDeliveryAddress : undefined,
      shippingAddress: selectedType === 'shipping' ? effectiveShippingAddress : undefined,
      billingAddress,
      couponCode: appliedCoupon?.code,
    };
  };

  if (!hydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
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

  const addressForFulfillment = selectedType === 'shipping' ? effectiveShippingAddress : effectiveDeliveryAddress;
  const shippingForConfirm =
    selectedType === 'pickup'
      ? undefined
      : {
          name: customerInfo.name,
          address: {
            line1: addressForFulfillment.street,
            city: addressForFulfillment.city,
            state: addressForFulfillment.state,
            postal_code: addressForFulfillment.zip,
            country: 'US',
          },
        };

  const summaryProps = {
    items,
    appliedCoupon,
    setCoupon,
    clearCoupon,
    subtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    processingFee,
    total,
    selectedType,
    isRecalculating: isDeliveryQuoting || isTaxQuoting,
  };

  return (
    <div className="bg-brand-bg">
      {/* Mobile-only: running total stays visible while scrolling the form,
          expandable to the full itemized breakdown — desktop shows the same
          panel permanently in its own column. */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-brand-border">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3"
          aria-expanded={mobileSummaryOpen}
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-text">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${mobileSummaryOpen ? 'rotate-180' : ''}`}
            />
            {mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}
          </span>
          <span className="text-sm font-semibold text-brand-brown">${total.toFixed(2)}</span>
        </button>
        <AnimatePresence initial={false}>
          {mobileSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-brand-border"
            >
              <div className="px-4 pb-4 pt-3">
                <OrderSummaryPanel {...summaryProps} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop: pinned to the viewport with `fixed` (not `sticky`), so the
          page itself never scrolls — only the form column's own overflow does.
          Centered via left-1/2 + -translate-x-1/2 rather than left+right so the
          max-w-5xl cap resolves correctly for a fixed-position box. */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-14 lg:fixed lg:inset-y-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-5xl lg:overflow-hidden lg:flex lg:flex-col lg:py-0">
        {!orderInfo.hasMinimumOrder && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6 py-4 lg:mt-14 lg:flex-shrink-0">
            <CardContent className="px-4 text-sm text-yellow-800">
              Your cart subtotal must be at least ${orderInfo.minimumRequired.toFixed(2)} to check out (currently $
              {orderInfo.currentTotal.toFixed(2)}).
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:flex-1 lg:min-h-0">
          {/* Left: plain, cardless summary — Stripe's own checkout keeps this
              side quiet; the elevated card is reserved for the form. Truly
              fixed (parent is `position:fixed`) — it never moves, regardless
              of how far the form column scrolls. */}
          <div className="hidden lg:block lg:h-full lg:overflow-y-auto lg:py-14">
            <OrderSummaryPanel {...summaryProps} />
          </div>

          {/* Right: one card holding contact, billing, delivery, and payment —
              same shape as Stripe's own full-page checkout. Offset down to
              align with the price line, not the logo — the logo stays the
              single tallest element on the page. This is the only column that
              scrolls on desktop. The 5.5rem/3.5rem offsets are margin (outside
              the scroll box) rather than padding, so the scrollbar's track
              hugs the card's own height exactly instead of including empty
              offset space above/below it. */}
          <div className="lg:mt-[5.5rem] lg:mb-14 lg:max-h-[calc(100%-9rem)] lg:overflow-y-auto lg:pr-[15px] checkout-scrollbar">
            <Card className="bg-white border-brand-border">
              <CardContent className="space-y-6">
                <div>
                  <FieldGroup>
                    <GroupField
                      label="Full name"
                      autoComplete="name"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleContactBlur('name')}
                      placeholder="Full name"
                      aria-invalid={!!contactErrors.name}
                      required
                    />
                    <GroupField
                      label="Email"
                      type="email"
                      autoComplete="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleContactBlur('email')}
                      placeholder="email@example.com"
                      aria-invalid={!!contactErrors.email}
                      required
                    />
                    <GroupField
                      label="Phone number"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleContactBlur('phone')}
                      placeholder="(404) 952-7610"
                      maxLength={14}
                      aria-invalid={!!contactErrors.phone}
                      required
                    />
                  </FieldGroup>
                  {contactErrors.name && <ErrorText>{contactErrors.name}</ErrorText>}
                  {contactErrors.email && <ErrorText>{contactErrors.email}</ErrorText>}
                  {contactErrors.phone && <ErrorText>{contactErrors.phone}</ErrorText>}
                </div>

                <div>
                  <h2 className="text-base font-semibold text-brand-text mb-3">Billing address</h2>
                  <AddressFields value={billingAddress} onChange={setBillingAddress} />
                  {billingError && <InlineErrorBanner className="mt-3">{billingError}</InlineErrorBanner>}
                </div>

                <div>
                  <h2 className="text-base font-semibold text-brand-text mb-3">Delivery method</h2>
                  <DeliverySelector
                    subtotal={subtotal}
                    shippingCost={shippingInfo.shippingCost}
                    blockedDates={blockedDates}
                    onDeliveryFeeChange={setDeliveryFee}
                    onQuotingChange={setIsDeliveryQuoting}
                  />
                  {deliveryError && <InlineErrorBanner className="mt-4">{deliveryError}</InlineErrorBanner>}
                </div>

                <div>
                  <h2 className="text-base font-semibold text-brand-text mb-3">Payment method</h2>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      mode: 'payment',
                      currency: 'usd',
                      amount: Math.max(50, Math.round(total * 100)),
                      appearance: {
                        variables: {
                          colorPrimary: '#9B562C',
                          colorText: '#211A16',
                          colorTextSecondary: '#6B5D54',
                          borderRadius: '8px',
                        },
                      },
                    }}
                  >
                    <PaymentSection
                      total={total}
                      onValidateAll={validateAll}
                      buildRequestBody={buildRequestBody}
                      customerName={customerInfo.name}
                      shippingForConfirm={shippingForConfirm}
                    />
                  </Elements>
                </div>

                <p className="flex items-center justify-center gap-1.5 text-xs text-brand-muted">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Secure checkout powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
