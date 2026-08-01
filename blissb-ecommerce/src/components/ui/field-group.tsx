import * as React from "react"

import { cn } from "@/lib/utils"

// Stripe's signature input pattern: related fields share one bordered,
// rounded container with hairline dividers between them, instead of each
// field being its own separately-boxed input with a gap.
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-brand-border divide-y divide-brand-border overflow-hidden bg-white",
        className
      )}
      {...props}
    />
  )
}

function GroupField({ label, className, ...props }: React.ComponentProps<"input"> & { label: string }) {
  return (
    <div className="px-3 py-2 focus-within:bg-brand-bg/60 transition-colors duration-150">
      <label className="block text-xs font-medium text-brand-muted mb-0.5">{label}</label>
      <input
        className={cn(
          "w-full border-0 p-0 bg-transparent text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-0",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { FieldGroup, GroupField }
