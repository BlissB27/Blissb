"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AddressFields } from "@/components/AddressFields";
import { useDeliveryStore, type DeliveryType, type ShippingAddress } from "@/store/deliveryStore";
import { getFulfillmentOptions } from "@/lib/deliverySchedule";
import { BAKERY_ADDRESS } from "@/lib/bakeryLocation";
import { isAddressComplete, joinAddress } from "@/lib/address";
import { AlertCircle, CheckCircle2, MapPin, Package, ShoppingBag, Truck, type LucideIcon } from "lucide-react";

const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BAKERY_ADDRESS)}`;

// Drops in from just above rather than a plain fade — used whenever the
// fulfillment type changes, so the newly-revealed section reads as "arriving"
// instead of popping in place.
const dropDownVariants = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export type DeliveryQuote = { eligible: boolean; fee: number; miles: number };

type DeliverySelectorProps = {
  subtotal: number;
  shippingCost: number;
  onDeliveryFeeChange: (fee: number) => void;
  onQuotingChange?: (quoting: boolean) => void;
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

// Per our shipping policy we only ship on Mondays via UPS (no per-order date
// picker) — this finds the next one, including today if today is Monday.
function getNextShipDate(now: Date): { dateISO: string; isToday: boolean } {
  const day = now.getUTCDay();
  const daysUntilMonday = (1 - day + 7) % 7;
  const target = new Date(now);
  target.setUTCDate(now.getUTCDate() + daysUntilMonday);
  return { dateISO: target.toISOString().slice(0, 10), isToday: daysUntilMonday === 0 };
}

export function DeliverySelector({ subtotal, shippingCost, onDeliveryFeeChange, onQuotingChange }: DeliverySelectorProps) {
  const {
    selectedType,
    billingAddress,
    deliveryAddress,
    deliveryAddressSameAsBilling,
    shippingAddress,
    shippingAddressSameAsBilling,
    setDeliveryType,
    setDeliveryAddress,
    setDeliveryAddressSameAsBilling,
    setShippingAddress,
    setShippingAddressSameAsBilling,
  } = useDeliveryStore();
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);

  const fulfillment = getFulfillmentOptions();
  const shipDate = getNextShipDate(new Date());

  // Defaults to the billing address collected up top — only the override
  // (when the customer says "use a different address") needs entering fresh.
  const effectiveDeliveryAddress = deliveryAddressSameAsBilling ? billingAddress : deliveryAddress;
  const deliveryAddressLine = joinAddress(effectiveDeliveryAddress);

  useEffect(() => {
    if (selectedType !== "delivery" || !isAddressComplete(effectiveDeliveryAddress)) {
      setQuote(null);
      setQuoteError(null);
      setIsQuoting(false);
      onQuotingChange?.(false);
      return;
    }

    setIsQuoting(true);
    onQuotingChange?.(true);
    const timer = setTimeout(() => {
      fetch("/api/delivery-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: deliveryAddressLine, subtotal }),
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
        .finally(() => {
          setIsQuoting(false);
          onQuotingChange?.(false);
        });
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryAddressLine, selectedType, subtotal]);

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

  const options: { type: DeliveryType; label: string }[] = [
    { type: "pickup", label: "Pickup" },
    { type: "delivery", label: "Delivery" },
    { type: "shipping", label: "Shipping" },
  ];

  return (
    <div className="space-y-4">
      {/* Fulfillment method — a compact toggle rather than a stacked list of
          bordered radio cards, so this reads as one lightweight choice, not
          three separate decisions. A fixed 3-column grid (not flex-wrap) so
          the three options always share one row, never wrapping regardless
          of container width or label length. */}
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const Icon = TYPE_ICONS[option.type];
          const isSelected = selectedType === option.type;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => setDeliveryType(option.type)}
              aria-pressed={isSelected}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                isSelected
                  ? "border-brand-brown bg-brand-brown/5 text-brand-brown"
                  : "border-brand-border text-brand-muted hover:border-brand-brown/40 hover:text-brand-text"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {option.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedType === "pickup" && (
          <motion.div
            key="pickup"
            variants={dropDownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-md rounded-lg border border-brand-border bg-brand-bg p-3 space-y-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1 text-brand-brown">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Pick up here</span>
              </div>
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-brand-brown hover:underline"
              >
                Get directions
              </a>
            </div>
            <div className="pt-3 border-t border-brand-border">
              <p className="text-xs text-brand-muted mb-0.5">Pickup</p>
              <p className="text-sm font-medium text-brand-text">
                {formatWindowDate(fulfillment.pickup.date, fulfillment.pickup.isToday)}, {fulfillment.pickup.window}
              </p>
            </div>
          </motion.div>
        )}

        {selectedType === "delivery" && (
          <motion.div
            key="delivery"
            variants={dropDownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-md rounded-lg border border-brand-border bg-brand-bg p-3 space-y-3"
          >
            <div className="space-y-2">
              {deliveryAddressSameAsBilling ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-brand-brown">Delivering to</p>
                    <p className="text-sm text-brand-text">
                      {isAddressComplete(billingAddress) ? deliveryAddressLine : "Same as billing address (enter it above)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeliveryAddressSameAsBilling(false)}
                    className="flex-shrink-0 text-sm text-brand-brown hover:underline"
                  >
                    Use a different address
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-brand-brown">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Delivery Address</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeliveryAddressSameAsBilling(true)}
                      className="text-sm text-brand-brown hover:underline"
                    >
                      Use my billing address instead
                    </button>
                  </div>
                  <AddressFields value={deliveryAddress} onChange={setDeliveryAddress} />
                </div>
              )}

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

            <div className="pt-3 border-t border-brand-border">
              <p className="text-xs text-brand-muted mb-0.5">Estimated delivery</p>
              <p className="text-sm font-medium text-brand-text">
                {formatWindowDate(fulfillment.delivery.date, fulfillment.delivery.isToday)}, {fulfillment.delivery.window}
              </p>
            </div>
          </motion.div>
        )}

        {selectedType === "shipping" && (
          <motion.div
            key="shipping"
            variants={dropDownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-md rounded-lg border border-brand-border bg-brand-bg p-3 space-y-3"
          >
            <div>
              {shippingAddressSameAsBilling ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-brand-brown">Shipping to</p>
                    <p className="text-sm text-brand-text">
                      {isAddressComplete(billingAddress) ? joinAddress(billingAddress) : "Same as billing address (enter it above)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShippingAddressSameAsBilling(false)}
                    className="flex-shrink-0 text-sm text-brand-brown hover:underline"
                  >
                    Use a different address
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-brand-brown">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Shipping Address</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShippingAddressSameAsBilling(true)}
                      className="text-sm text-brand-brown hover:underline"
                    >
                      Use my billing address instead
                    </button>
                  </div>
                  <AddressFields value={shippingAddress} onChange={setShippingAddress} />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-brand-border">
              <p className="text-xs text-brand-muted mb-0.5">Estimated delivery</p>
              <p className="text-sm font-medium text-brand-text">
                Ships {formatWindowDate(shipDate.dateISO, shipDate.isToday)} via UPS
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
