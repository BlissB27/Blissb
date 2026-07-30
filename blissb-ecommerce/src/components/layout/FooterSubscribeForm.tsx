"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FooterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
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
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="text-sm text-white/85">You&apos;re subscribed!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 sm:items-start">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={status === "loading"}
          className="h-9 w-44 border-white/25 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30 sm:w-52"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-9 shrink-0 bg-white text-[#5C3319] hover:bg-white/90"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-200">{error}</p>}
    </form>
  );
}
