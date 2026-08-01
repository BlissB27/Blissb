"use client";

import { useEffect, useState } from "react";
import { Elements, AddressElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import { Input } from "@/components/ui/input";
import { useDeliveryStore, type DeliveryType } from "@/store/deliveryStore";
import { getFulfillmentOptions } from "@/lib/deliverySchedule";
import { AlertCircle, CheckCircle2, MapPin, Package, ShoppingBag, Truck, type LucideIcon } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export type DeliveryQuote = { eligible: boolean; fee: number; miles: number };

type DeliverySelectorProps = {
  subtotal: number;
  shippingCost: number;
  onDeliveryFeeChange: (fee: number) => void;
  /** Pre-fills the AddressElement's (otherwise unavoidable) name field, since
   * Contact Information is collected on the same page — avoids asking twice. */
  customerName?: string;
};

const TYPE_ICONS: Record<DeliveryType, LucideIcon> = {
  shipping: Package,
  delivery: Truck,
  pickup: ShoppingBag,
};

function formatWindowDate(dateISO: string, isToday: boolean) {
  const date = new Date(`${dateISO}T12:00:00Z`);
  const formatted = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "short", day: "numeric" }).format(date);
  return isToday ? `Today, ${formatted}` : formatted;
}

export function DeliverySelector({ subtotal, shippingCost, onDeliveryFeeChange, customerName }: DeliverySelectorProps) {
  const { selectedType, address, setDeliveryType, setAddress, shippingAddress, setShippingAddress } = useDeliveryStore();
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);

  const fulfillment = getFulfillmentOptions();

  useEffect(() => {
    if (selectedType !== "delivery" || address.trim().length < 8) {
      setQuote(null);
      setQuoteError(null);
      setIsQuoting(false);
      return;
    }

    setIsQuoting(true);
    const timer = setTimeout(() => {
      fetch("/api/delivery-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, subtotal }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            setQuoteError(data.error ?? "Couldn't calculate delivery for this address.");
            setQuote(null);
          } else {
            setQuote(data);
            setQuoteError(null);
          }
        })
        .catch(() => {
          setQuoteError("Couldn't calculate delivery for this address. Check your connection and try again.");
          setQuote(null);
        })
        .finally(() => setIsQuoting(false));
    }, 600);

    return () => clearTimeout(timer);
  }, [address, selectedType, subtotal]);

  useEffect(() => {
    if (selectedType === "delivery") {
      onDeliveryFeeChange(quote?.eligible ? quote.fee : 0);
    } else if (selectedType === "shipping") {
      onDeliveryFeeChange(shippingCost);
    } else {
      onDeliveryFeeChange(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote, selectedType, shippingCost]);

  const handleShippingAddressElementChange = (event: StripeAddressElementChangeEvent) => {
    if (!event.complete) return;
    const { line1, line2, city, state, postal_code } = event.value.address;
    setShippingAddress({
      street: line2 ? `${line1} ${line2}` : line1,
      city,
      state,
      zip: postal_code,
    });
  };

  const options: { type: DeliveryType; label: string }[] = [
    { type: "pickup", label: "Pickup" },
    { type: "delivery", label: "Local Delivery" },
    { type: "shipping", label: "Shipping" },
  ];

  return (
    <div className="space-y-4">
      {/* Fulfillment method — a compact toggle rather than a stacked list of
          bordered radio cards, so this reads as one lightweight choice, not
          three separate decisions. */}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const Icon = TYPE_ICONS[option.type];
          const isSelected = selectedType === option.type;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => setDeliveryType(option.type)}
              aria-pressed={isSelected}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isSelected
                  ? "border-brand-brown bg-brand-brown/5 text-brand-brown"
                  : "border-brand-border text-brand-muted hover:border-brand-brown/40 hover:text-brand-text"
              }`}
            >
              <Icon className="w-4 h-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      {selectedType === "delivery" && (
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2 text-brand-brown">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Delivery Address</span>
          </div>
          <Input
            type="text"
            placeholder="Street address, city, state, ZIP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-brand-border focus:border-brand-brown"
          />
          {isQuoting && <p className="text-sm text-brand-muted">Calculating delivery distance…</p>}
          {!isQuoting && quoteError && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {quoteError}
            </div>
          )}
          {!isQuoting && quote?.eligible && (
            <div className="text-sm text-brand-success flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {quote.miles.toFixed(1)} miles away — {quote.fee > 0 ? `$${quote.fee.toFixed(2)} delivery fee` : "free delivery!"}
            </div>
          )}
          {!isQuoting && quote && !quote.eligible && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              This address is outside our 25-mile delivery radius. Please choose shipping or pickup instead.
            </div>
          )}
        </div>
      )}

      {selectedType === "shipping" && (
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2 text-brand-brown">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Shipping Address</span>
          </div>
          {/* Stripe's AddressElement — real autocomplete/suggestions as you type,
              plus built-in validation. Needs its own <Elements> since there's no
              PaymentIntent yet at this step (that's created later, in Payment). */}
          <Elements stripe={stripePromise} options={{ mode: "payment", currency: "usd", amount: 100 }}>
            <AddressElement
              options={{
                mode: "shipping",
                allowedCountries: ["US"],
                fields: { phone: "never" },
                defaultValues: {
                  name: customerName || null,
                  address: {
                    line1: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postal_code: shippingAddress.zip,
                    country: "US",
                  },
                },
              }}
              onChange={handleShippingAddressElementChange}
            />
          </Elements>
        </div>
      )}

      {(selectedType === "delivery" || selectedType === "pickup") && (
        <p className="text-sm text-brand-muted">
          {selectedType === "delivery" ? "Estimated delivery" : "Pickup"}:{" "}
          <span className="font-medium text-brand-text">
            {formatWindowDate(fulfillment[selectedType].date, fulfillment[selectedType].isToday)}, {fulfillment[selectedType].window}
          </span>
        </p>
      )}
    </div>
  );
}
