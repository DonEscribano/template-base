"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-[var(--color-muted)]/20 bg-[var(--color-secondary)]",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
          aria-label="Home"
        >
          Logo
        </Link>

        {/* Desktop nav */}
        <Navigation className="hidden lg:flex" />

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="primary" asChild>
            <Link href="/reservas">Reservar</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-[var(--color-text)] hover:bg-[var(--color-muted)]/10 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
