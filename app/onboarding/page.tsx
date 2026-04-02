"use client";

import { useState } from "react";

interface OnboardingData {
  businessName: string;
  description: string;
  services: string;
  schedule: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  socialMedia: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  notes: string;
}

export default function OnboardingPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: OnboardingData = {
      businessName: formData.get("businessName") as string,
      description: formData.get("description") as string,
      services: formData.get("services") as string,
      schedule: formData.get("schedule") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      socialMedia: formData.get("socialMedia") as string,
      domain: formData.get("domain") as string,
      primaryColor: formData.get("primaryColor") as string,
      secondaryColor: formData.get("secondaryColor") as string,
      notes: formData.get("notes") as string,
    };

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormState("sent");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  if (formState === "sent") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Informacion recibida</h1>
          <p className="mt-2 text-[var(--color-text)]/60">
            Gracias por completar el formulario. Nos pondremos en contacto contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Bienvenido al proyecto</h1>
          <p className="mt-2 text-[var(--color-text)]/60">
            Necesitamos algunos datos para empezar a construir tu web. Rellena todo lo que puedas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {/* Datos del negocio */}
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] border-b border-gray-200 pb-2">
              Datos del negocio
            </h2>
            <div className="mt-4 space-y-4">
              <Field label="Nombre del negocio *" name="businessName" required />
              <FieldTextarea label="Descripcion del negocio *" name="description" required
                placeholder="Cuenta brevemente a que te dedicas, tu especialidad, anos de experiencia..." />
              <FieldTextarea label="Servicios y precios *" name="services" required
                placeholder="Lista tus servicios con el precio y duracion de cada uno" />
              <FieldTextarea label="Horario de atencion *" name="schedule" required
                placeholder="Ej: Lunes a viernes de 9:00 a 20:00, Sabados de 9:00 a 14:00" />
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] border-b border-gray-200 pb-2">
              Contacto
            </h2>
            <div className="mt-4 space-y-4">
              <Field label="Direccion completa" name="address" placeholder="Calle, numero, ciudad, CP" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Telefono *" name="phone" type="tel" required />
                <Field label="Email *" name="email" type="email" required />
              </div>
              <Field label="WhatsApp Business" name="whatsapp" type="tel" placeholder="+34..." />
              <Field label="Redes sociales" name="socialMedia" placeholder="Instagram, Facebook, etc. (URLs)" />
            </div>
          </section>

          {/* Diseno */}
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] border-b border-gray-200 pb-2">
              Diseno
            </h2>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-[var(--color-text)]/60">
                Sube tu logo y fotos del negocio por email o WhatsApp. Aqui indicanos los colores.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Color principal</label>
                  <input type="color" name="primaryColor" defaultValue="#1e40af"
                    className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Color secundario</label>
                  <input type="color" name="secondaryColor" defaultValue="#3b82f6"
                    className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-300" />
                </div>
              </div>
              <Field label="Dominio deseado" name="domain" placeholder="www.minegocio.es" />
            </div>
          </section>

          {/* Notas */}
          <section>
            <FieldTextarea label="Notas adicionales" name="notes"
              placeholder="Cualquier cosa que quieras comentarnos: preferencias de diseno, funcionalidades especiales, etc." />
          </section>

          <button
            type="submit"
            disabled={formState === "sending"}
            className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
          >
            {formState === "sending" ? "Enviando..." : "Enviar informacion"}
          </button>

          {formState === "error" && (
            <p className="text-center text-sm text-red-600">Error al enviar. Intentalo de nuevo.</p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text)]">{label}</label>
      <input type={type} name={name} id={name} required={required} placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
    </div>
  );
}

function FieldTextarea({ label, name, required, placeholder }: {
  label: string; name: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text)]">{label}</label>
      <textarea name={name} id={name} rows={3} required={required} placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
    </div>
  );
}
