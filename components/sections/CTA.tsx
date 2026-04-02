import Link from "next/link";

interface CTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTA({
  title = "Reserva tu cita ahora",
  subtitle = "Estamos aqui para ayudarte. Reserva online o contactanos directamente.",
  buttonText = "Reservar cita",
  buttonHref = "/reservas",
}: CTAProps) {
  return (
    <section className="bg-[var(--color-primary)] py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-white/80">{subtitle}</p>
        <div className="mt-8">
          <Link
            href={buttonHref}
            className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-[var(--color-primary)] shadow-lg transition hover:bg-white/90"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
