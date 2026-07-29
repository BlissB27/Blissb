"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDeliveryStore, type DeliveryType } from "@/store/deliveryStore";
import { getFulfillmentOptions } from "@/lib/deliverySchedule";
import { AlertCircle, CheckCircle2, MapPin, Package, ShoppingBag, Truck, type LucideIcon } from "lucide-react";

export type DeliveryQuote = { eligible: boolean; fee: number; miles: number };

type DeliverySelectorProps = {
  subtotal: number;
  shippingCost: number;
  onDeliveryFeeChange: (fee: number) => void;
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

export function DeliverySelector({ subtotal, shippingCost, onDeliveryFeeChange }: DeliverySelectorProps) {
  const { selectedType, address, setDeliveryType, setAddress } = useDeliveryStore();
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

  const options: { type: DeliveryType; label: string; description: string }[] = [
    { type: "shipping", label: "Shipping", description: "Nationwide, 3-5 business days" },
    { type: "delivery", label: "Local Delivery", description: "Within 25 miles of Braselton, GA" },
    { type: "pickup", label: "Pickup", description: "At the bakery, or Saturday at the farmers market" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-brand-brown mb-4">Choose Your Delivery Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((option) => {
            const Icon = TYPE_ICONS[option.type];
            const isSelected = selectedType === option.type;
            let feeLabel = "Free";
            if (option.type === "shipping" && shippingCost > 0) feeLabel = `$${shippingCost.toFixed(2)}`;
            if (option.type === "delivery") {
              if (!address.trim()) feeLabel = "Enter address";
              else if (isQuoting) feeLabel = "Calculating…";
              else if (quoteError) feeLabel = "—";
              else if (quote) feeLabel = quote.eligible ? (quote.fee > 0 ? `$${quote.fee.toFixed(2)}` : "Free") : "Out of range";
            }

            return (
              <Card
                key={option.type}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected ? "border-brand-brown bg-brand-brown/5" : "border-brand-border hover:border-brand-brown/50"
                }`}
                onClick={() => setDeliveryType(option.type)}
              >
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <Icon className={`w-10 h-10 ${isSelected ? "text-brand-brown" : "text-brand-muted"}`} />
                  </div>
                  <h4 className="font-medium text-brand-text">{option.label}</h4>
                  <p className="text-sm text-brand-muted">{option.description}</p>
                  <Badge
                    variant="secondary"
                    className={
                      feeLabel === "Free"
                        ? "bg-brand-success text-white"
                        : feeLabel === "Enter address" || feeLabel === "Calculating…"
                        ? "bg-brand-border text-brand-muted"
                        : feeLabel === "Out of range"
                        ? "bg-red-100 text-red-700"
                        : "bg-brand-accent text-brand-brown"
                    }
                  >
                    {feeLabel}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedType === "delivery" && (
        <div>
          <h3 className="text-lg font-semibold text-brand-brown mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Address
          </h3>
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Street address, city, state, ZIP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-brand-border focus:border-brand-brown"
            />
            {isQuoting && (
              <p className="mt-2 text-sm text-brand-muted">Calculating delivery distance…</p>
            )}
            {!isQuoting && quoteError && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {quoteError}
              </div>
            )}
            {!isQuoting && quote?.eligible && (
              <div className="mt-2 text-sm text-brand-success flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {quote.miles.toFixed(1)} miles away — {quote.fee > 0 ? `$${quote.fee.toFixed(2)} delivery fee` : "free delivery!"}
              </div>
            )}
            {!isQuoting && quote && !quote.eligible && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                This address is outside our 25-mile delivery radius. Please choose shipping or pickup instead.
              </div>
            )}
          </div>
        </div>
      )}

      {(selectedType === "delivery" || selectedType === "pickup") && (
        <Card className="p-4 border-brand-border bg-brand-bg">
          <p className="text-sm text-brand-muted">
            {selectedType === "delivery" ? "Estimated delivery" : "Pickup"}:{" "}
            <span className="font-medium text-brand-text">
              {formatWindowDate(fulfillment[selectedType].date, fulfillment[selectedType].isToday)}, {fulfillment[selectedType].window}
            </span>
          </p>
        </Card>
      )}
    </div>
  );
}
