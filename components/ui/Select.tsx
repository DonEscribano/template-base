import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, description, className, id, children, ...props }, ref) {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border bg-[var(--color-secondary)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[var(--color-destructive)]"
              : "border-[var(--color-muted)]/30",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${selectId}-error`
              : description
                ? `${selectId}-description`
                : undefined
          }
          {...props}
        >
          {children}
        </select>
        {description && !error && (
          <p
            id={`${selectId}-description`}
            className="text-xs text-[var(--color-muted)]"
          >
            {description}
          </p>
        )}
        {error && (
          <p
            id={`${selectId}-error`}
            className="text-xs text-[var(--color-destructive)]"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
