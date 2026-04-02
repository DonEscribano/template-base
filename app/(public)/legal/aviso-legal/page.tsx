import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal",
};

export default function AvisoLegalPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Nuestro negocio";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">Aviso Legal</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-text)]/70">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Datos identificativos</h2>
        <p>
          En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
          Informacion y de Comercio Electronico, le informamos que este sitio web es propiedad
          de {siteName}.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Objeto</h2>
        <p>
          El presente sitio web tiene por objeto facilitar al publico en general el conocimiento
          de las actividades y servicios que {siteName} realiza.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Propiedad intelectual</h2>
        <p>
          Los contenidos de este sitio web, incluyendo textos, imagenes, graficos, diseno y codigo
          fuente, son propiedad de {siteName} o de terceros que han autorizado su uso. Queda
          prohibida su reproduccion, distribucion o transformacion sin autorizacion expresa.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Responsabilidad</h2>
        <p>
          {siteName} no se hace responsable de los danos y perjuicios que pudieran derivarse
          del uso de este sitio web. Tampoco garantiza la ausencia de virus u otros elementos
          que pudieran alterar su sistema informatico.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Enlaces externos</h2>
        <p>
          Este sitio web puede contener enlaces a sitios de terceros. {siteName} no se
          responsabiliza del contenido ni del funcionamiento de dichos sitios.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Legislacion aplicable</h2>
        <p>
          Las relaciones establecidas entre {siteName} y el usuario de este sitio web se rigen
          por la legislacion espanola vigente.
        </p>

        <p className="text-xs text-[var(--color-text)]/40 pt-4">
          Ultima actualizacion: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>
    </div>
  );
}
