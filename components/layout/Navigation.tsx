"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { getNavLinks } from "@/lib/config/navigation";

interface NavigationProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  onLinkClick?: () => void;
}

export function Navigation({
  className,
  orientation = "horizontal",
  onLinkClick,
}: NavigationProps) {
  const pathname = usePathname();
  const links = getNavLinks();

  return (
    <nav
      className={cn(
        "flex gap-1",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className
      )}
      aria-label="Main navigation"
    >
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-[var(--color-muted)]/10 hover:text-[var(--color-primary)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              isActive
                ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "text-[var(--color-text)]"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
