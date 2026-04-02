import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText = "Reservar cita",
  ctaHref = "/reservas",
  imageUrl,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
                {subtitle}
              </p>
            )}
            <div className="mt-10 flex gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-lg transition hover:bg-white/90"
              >
                {ctaText}
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contacto
              </Link>
            </div>
          </div>
          {imageUrl && (
            <div className="relative hidden lg:block">
              <img
                src={imageUrl}
                alt={title}
                className="rounded-2xl shadow-2xl"
                width={600}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
