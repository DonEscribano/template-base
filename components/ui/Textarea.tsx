import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, description, className, id, ...props }, ref) {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-[var(--color-secondary)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] transition-colors",
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
              ? `${textareaId}-error`
              : description
                ? `${textareaId}-description`
                : undefined
          }
          {...props}
        />
        {description && !error && (
          <p
            id={`${textareaId}-description`}
            className="text-xs text-[var(--color-muted)]"
          >
            {description}
          </p>
        )}
        {error && (
          <p
            id={`${textareaId}-error`}
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
