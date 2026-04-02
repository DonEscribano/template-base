"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ label, className, id, ...props }, ref) {
    const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={switchId}
        className={cn("inline-flex cursor-pointer items-center gap-2", className)}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              "block h-6 w-11 rounded-full border border-[var(--color-muted)]/30 bg-[var(--color-muted)]/20 transition-colors",
              "peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] peer-focus-visible:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
              "peer-checked:translate-x-5"
            )}
            aria-hidden="true"
          />
        </span>
        {label && (
          <span className="text-sm text-[var(--color-text)]">{label}</span>
        )}
      </label>
    );
  }
);
