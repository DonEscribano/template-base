import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Cookies",
};

export default function CookiesPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Nuestro negocio";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">Politica de Cookies</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-text)]/70">
        <p>
          Este sitio web utiliza cookies para mejorar su experiencia de navegacion.
          A continuacion le explicamos que son las cookies y como las utilizamos.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Que son las cookies</h2>
        <p>
          Las cookies son pequenos archivos de texto que se almacenan en su dispositivo cuando
          visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen
          de manera mas eficiente y para proporcionar informacion a los propietarios del sitio.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Cookies que utilizamos</h2>

        <h3 className="font-semibold text-[var(--color-text)]">Cookies necesarias</h3>
        <p>
          Estas cookies son esenciales para el funcionamiento del sitio web. Incluyen cookies
          de sesion y de autenticacion. No se pueden desactivar.
        </p>

        <h3 className="font-semibold text-[var(--color-text)]">Cookies de analisis</h3>
        <p>
          Si usted lo consiente, utilizamos Google Analytics 4 para comprender como los visitantes
          interactuan con nuestro sitio web. Estas cookies nos ayudan a mejorar nuestros servicios.
        </p>

        <h3 className="font-semibold text-[var(--color-text)]">Cookies de marketing</h3>
        <p>
          Si usted lo consiente, utilizamos el pixel de Meta para medir la efectividad de
          nuestras campanas publicitarias.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Como gestionar las cookies</h2>
        <p>
          Puede aceptar o rechazar las cookies no esenciales a traves del banner que aparece
          al visitar nuestro sitio por primera vez. Tambien puede configurar su navegador
          para bloquear o eliminar cookies.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Mas informacion</h2>
        <p>
          Para mas informacion sobre como tratamos sus datos, consulte nuestra{" "}
          <a href="/legal/privacidad" className="text-[var(--color-primary)] underline">
            Politica de Privacidad
          </a>.
        </p>

        <p className="text-xs text-[var(--color-text)]/40 pt-4">
          Ultima actualizacion: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>
    </div>
  );
}
