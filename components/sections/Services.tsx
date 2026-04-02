interface Service {
  name: string;
  description?: string;
  duration_minutes: number;
  price_cents: number;
  image_url?: string;
  slug: string;
}

interface ServicesProps {
  services: Service[];
  title?: string;
  subtitle?: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function Services({
  services,
  title = "Nuestros servicios",
  subtitle,
}: ServicesProps) {
  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-[var(--color-text)]/60">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.slug}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}
              <h3 className="text-xl font-semibold text-[var(--color-text)]">
                {service.name}
              </h3>
              {service.description && (
                <p className="mt-2 text-sm text-[var(--color-text)]/60 leading-relaxed">
                  {service.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {formatPrice(service.price_cents)}
                </span>
                <span className="text-sm text-[var(--color-text)]/40">
                  {service.duration_minutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
