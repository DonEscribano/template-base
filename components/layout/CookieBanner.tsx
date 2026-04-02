"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

const COOKIE_CONSENT_KEY = "cookie-consent";

type ConsentValue = "accepted" | "rejected";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function handleConsent(value: ConsentValue) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-muted)]/20 bg-[var(--color-secondary)] p-4 shadow-lg",
        "sm:flex sm:items-center sm:justify-between sm:gap-4"
      )}
      role="banner"
      aria-label="Cookie consent"
    >
      <p className="mb-3 text-sm text-[var(--color-text)] sm:mb-0">
        Utilizamos cookies propias y de terceros para mejorar nuestros servicios.
        Puedes aceptar o rechazar su uso. Mas informacion en nuestra{" "}
        <a
          href="/legal/cookies"
          className="font-medium text-[var(--color-primary)] underline hover:text-[var(--color-primary)]/80"
        >
          Politica de Cookies
        </a>
        .
      </p>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleConsent("rejected")}
        >
          Rechazar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleConsent("accepted")}
        >
          Aceptar
        </Button>
      </div>
    </div>
  );
}
