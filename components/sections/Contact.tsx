"use client";

import { useState } from "react";

interface ContactProps {
  email?: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
}

export function Contact({ email, phone, address, mapEmbedUrl }: ContactProps) {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
        }),
      });

      if (res.ok) {
        setFormState("sent");
        form.reset();
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  return (
    <section className="py-20 bg-[var(--color-background)]" id="contacto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          Contacto
        </h2>
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)]">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)]">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text)]">
                  Telefono
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)]">
                Mensaje *
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="consent" className="text-xs text-[var(--color-text)]/60">
                Acepto la <a href="/legal/privacidad" className="underline">politica de privacidad</a> y
                el tratamiento de mis datos para responder a mi consulta.
              </label>
            </div>
            <button
              type="submit"
              disabled={formState === "sending"}
              className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
            >
              {formState === "sending" ? "Enviando..." : formState === "sent" ? "Mensaje enviado" : "Enviar mensaje"}
            </button>
            {formState === "error" && (
              <p className="text-sm text-red-600">Error al enviar. Intentalo de nuevo.</p>
            )}
          </form>

          <div className="space-y-6">
            {address && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Direccion</h3>
                <p className="mt-1 text-sm text-[var(--color-text)]/60">{address}</p>
              </div>
            )}
            {phone && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Telefono</h3>
                <p className="mt-1 text-sm text-[var(--color-text)]/60">
                  <a href={`tel:${phone}`} className="hover:text-[var(--color-primary)]">{phone}</a>
                </p>
              </div>
            )}
            {email && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Email</h3>
                <p className="mt-1 text-sm text-[var(--color-text)]/60">
                  <a href={`mailto:${email}`} className="hover:text-[var(--color-primary)]">{email}</a>
                </p>
              </div>
            )}
            {mapEmbedUrl && (
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={mapEmbedUrl}
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicacion"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
