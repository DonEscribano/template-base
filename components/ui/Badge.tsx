import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

const variantStyles = {
  default:
    "bg-[var(--color-primary)] text-white",
  secondary:
    "bg-[var(--color-muted)]/10 text-[var(--color-text)]",
  success:
    "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  warning:
    "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  destructive:
    "bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]",
  outline:
    "border border-current bg-transparent text-[var(--color-text)]",
} as const;

interface BadgeProps {
  variant?: keyof typeof variantStyles;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
