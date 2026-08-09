'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SUBSCRIBED_KEY = 'bliss-b-newsletter-subscribed';
const LAST_SHOWN_KEY = 'bliss-b-newsletter-modal-last-shown';
const FIRST_SHOW_DELAY_MS = 4_000;
const REAPPEAR_INTERVAL_MS = 30 * 60 * 1000;

// A bitten cookie mark for the signup header — on-brand in place of a generic gift icon.
function CookieMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill="var(--brand-brown)" />
      <circle cx="46" cy="14" r="11" fill="#fff" />
      <circle cx="19" cy="20" r="3" fill="var(--brand-bg)" />
      <circle cx="31" cy="17" r="2.2" fill="var(--brand-bg)" />
      <circle cx="35" cy="30" r="2.6" fill="var(--brand-bg)" />
      <circle cx="21" cy="34" r="2.4" fill="var(--brand-bg)" />
      <circle cx="15" cy="28" r="1.8" fill="var(--brand-bg)" />
    </svg>
  );
}

export function NewsletterDiscountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  // Reschedules itself every time the dialog closes: once subscribed, never
  // again; otherwise wait out whatever's left of the 30-minute window since
  // it was last shown (persisted so a page reload doesn't reset the clock).
  useEffect(() => {
    if (isOpen) return;
    if (localStorage.getItem(SUBSCRIBED_KEY)) return;

    const lastShown = Number(localStorage.getItem(LAST_SHOWN_KEY) || 0);
    const delay = lastShown ? Math.max(REAPPEAR_INTERVAL_MS - (Date.now() - lastShown), 0) : FIRST_SHOW_DELAY_MS;

    const timer = window.setTimeout(() => setIsOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const dismiss = () => {
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubscribed(true);
      localStorage.setItem(SUBSCRIBED_KEY, 'true');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border-brand-border bg-white p-0 text-brand-text shadow-2xl sm:max-w-md">
        {subscribed ? (
          <div className="px-6 py-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
              className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-brand-success"
            >
              <Check className="h-5 w-5 text-white" strokeWidth={2} aria-hidden="true" />
            </motion.div>
            <DialogTitle asChild>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl font-bold text-brand-text mb-2"
              >
                Thank you!
              </motion.h2>
            </DialogTitle>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-sm text-brand-muted"
            >
              Check your inbox — your discount code is on its way.
            </motion.p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center px-6 pt-8 pb-2 text-center">
              <CookieMark className="mb-3 h-14 w-14" />
              <DialogHeader className="items-center gap-2 text-center">
                <DialogTitle className="text-2xl font-bold leading-tight text-brand-brown">A Sweet Welcome</DialogTitle>
                <DialogDescription className="text-base leading-6 text-brand-muted">
                  Subscribe to our newsletter and enjoy 10% off your first order.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pt-1 pb-5 space-y-3 text-center">
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
                {isSubmitting ? 'Signing up...' : 'Get my code'}
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
