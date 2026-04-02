import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Contact } from "@/components/sections/Contact";

// These would come from Supabase in a real project.
// BUILDER replaces with actual data from the spec.
const DEMO_SERVICES = [
  { name: "Fisioterapia General", slug: "fisioterapia-general", description: "Tratamiento personalizado para recuperar tu bienestar fisico.", duration_minutes: 60, price_cents: 4500 },
  { name: "Masaje Deportivo", slug: "masaje-deportivo", description: "Masaje especializado para deportistas y lesiones musculares.", duration_minutes: 45, price_cents: 3500 },
  { name: "Rehabilitacion", slug: "rehabilitacion", description: "Programa de rehabilitacion post-operatoria y lesiones cronicas.", duration_minutes: 90, price_cents: 6000 },
];

const DEMO_TESTIMONIALS = [
  { name: "Ana M.", rating: 5, comment: "Excelente trato y resultados visibles desde la primera sesion. Muy recomendable." },
  { name: "Pedro L.", rating: 5, comment: "Profesionales de primera. Me recupere de la lesion mucho antes de lo esperado." },
  { name: "Laura G.", rating: 4, comment: "Muy buena atencion y facilidad para reservar cita online. Volveremos seguro." },
];

export default function HomePage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Nuestro negocio";

  return (
    <>
      <Hero
        title="Tu salud en manos expertas"
        subtitle={`En ${siteName} ofrecemos tratamientos personalizados para tu bienestar. Reserva tu cita online.`}
      />
      <Services
        services={DEMO_SERVICES}
        subtitle="Tratamientos personalizados para cada necesidad"
      />
      <Testimonials testimonials={DEMO_TESTIMONIALS} />
      <CTA />
      <Contact
        email="info@ejemplo.es"
        phone="+34 928 000 000"
        address="Calle Ejemplo 1, Las Palmas de Gran Canaria"
      />
    </>
  );
}
