import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

const variantStyles = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90",
  secondary:
    "bg-[var(--color-muted)]/10 text-[var(--color-text)] hover:bg-[var(--color-muted)]/20",
  outline:
    "border border-[var(--color-muted)]/30 bg-transparent text-[var(--color-text)] hover:bg-[var(--color-muted)]/10",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-muted)]/10",
  destructive:
    "bg-[var(--color-destructive)] text-white hover:bg-[var(--color-destructive)]/90",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      asChild: _asChild,
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);
