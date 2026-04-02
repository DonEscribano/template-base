import { Services } from "@/components/sections/Services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Conoce todos nuestros servicios y tratamientos.",
};

// BUILDER replaces with Supabase query
const DEMO_SERVICES = [
  { name: "Fisioterapia General", slug: "fisioterapia-general", description: "Tratamiento personalizado para recuperar tu bienestar fisico. Evaluacion completa, plan de tratamiento y seguimiento.", duration_minutes: 60, price_cents: 4500 },
  { name: "Masaje Deportivo", slug: "masaje-deportivo", description: "Masaje especializado para deportistas. Prevencion y recuperacion de lesiones musculares.", duration_minutes: 45, price_cents: 3500 },
  { name: "Rehabilitacion", slug: "rehabilitacion", description: "Programa completo de rehabilitacion post-operatoria y para lesiones cronicas.", duration_minutes: 90, price_cents: 6000 },
];

export default function ServiciosPage() {
  return (
    <div className="py-8">
      <Services
        services={DEMO_SERVICES}
        title="Todos nuestros servicios"
        subtitle="Elige el tratamiento que mejor se adapte a tus necesidades"
      />
    </div>
  );
}
