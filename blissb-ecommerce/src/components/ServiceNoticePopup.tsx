"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ServiceNoticePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="border-[#E6D7CB] bg-[#FFF9F4] p-0 text-[#3B2A22] shadow-2xl sm:max-w-md">
        <div className="border-b border-[#E6D7CB] bg-[#F8EDE4] px-6 py-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#8F4B2B] text-white">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>

          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-2xl font-bold leading-tight text-[#8F4B2B]">
              Temporary Service Notice
            </DialogTitle>
            <DialogDescription className="text-base leading-6 text-[#6E5B4E]">
              Delivery and online orders are currently unavailable until{" "}
              <span className="font-semibold text-[#3B2A22]">May 27</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-[#6E5B4E]">
            We apologize for the inconvenience and appreciate your
            understanding. For more information about dessert cart reservations
            or any of our other services, please contact us.
          </p>
        </div>

        <DialogFooter className="gap-3 border-t border-[#E6D7CB] px-6 py-4 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="border-[#D8C4B6] text-[#6E5B4E] hover:bg-[#F8EDE4] hover:text-[#8F4B2B]"
          >
            Close
          </Button>
          <Button
            asChild
            className="bg-[#8F4B2B] text-white hover:bg-[#6f3a22]"
          >
            <Link href="/contact" onClick={() => handleOpenChange(false)}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact Us
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
