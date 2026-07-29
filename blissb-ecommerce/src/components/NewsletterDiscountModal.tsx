"use client";

import { useEffect, useState } from "react";
import { Gift, Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DISMISSED_KEY = "bliss-b-newsletter-modal-dismissed";
const DISCOUNT_CODE = "WELCOME5";

export function NewsletterDiscountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    const timer = window.setTimeout(() => setIsOpen(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) dismiss();
    else setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubscribed(true);
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border-brand-border bg-white p-0 text-brand-text shadow-2xl sm:max-w-md">
        {subscribed ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-success">
              <Check className="h-7 w-7 text-white" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">You&apos;re in!</h2>
            <p className="text-sm text-brand-muted mb-5">
              Here&apos;s your code — enter it at checkout for 5% off your order.
            </p>
            <button
              type="button"
              onClick={handleCopyCode}
              className="mx-auto flex items-center gap-2 rounded-full border border-brand-brown px-5 py-2 font-mono text-lg font-semibold text-brand-brown hover:bg-brand-brown/5 transition-colors"
            >
              {DISCOUNT_CODE}
              {copied ? <Check className="h-4 w-4" strokeWidth={1.75} /> : <Copy className="h-4 w-4" strokeWidth={1.75} />}
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-brand-border px-6 py-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-brown">
                <Gift className="h-5 w-5 text-white" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <DialogHeader className="gap-2 text-left">
                <DialogTitle className="text-2xl font-bold leading-tight text-brand-brown">
                  Get 5% off your first order
                </DialogTitle>
                <DialogDescription className="text-base leading-6 text-brand-muted">
                  Sign up for our newsletter and we&apos;ll send you a discount code right away.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border-brand-border focus:border-brand-brown"
                disabled={isSubmitting}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Signing up..." : "Get my code"}
              </Button>
              <button
                type="button"
                onClick={dismiss}
                className="w-full text-center text-sm text-brand-muted hover:text-brand-brown"
              >
                No thanks
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
