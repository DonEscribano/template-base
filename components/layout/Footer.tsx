import Link from "next/link";
import { getNavLinks } from "@/lib/config/navigation";

const legalLinks = [
  { label: "Aviso Legal", href: "/legal/aviso-legal" },
  { label: "Politica de Privacidad", href: "/legal/privacidad" },
  { label: "Politica de Cookies", href: "/legal/cookies" },
];

export function Footer() {
  const navLinks = getNavLinks();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-muted)]/20 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Navegacion
            </h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Contacto
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
              <li>info@ejemplo.com</li>
              <li>+34 600 000 000</li>
              <li>Calle Ejemplo 1, Ciudad</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-muted)]/20 pt-8 text-center text-sm text-[var(--color-muted)]">
          {currentYear} Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
