import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
};

export default function PrivacidadPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Nuestro negocio";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">Politica de Privacidad</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--color-text)]/70">
        <p>
          En {siteName}, accesible desde {process.env.NEXT_PUBLIC_SITE_URL || "nuestro sitio web"},
          una de nuestras prioridades principales es la privacidad de nuestros visitantes.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento de los datos personales es {siteName}.
          Puede contactarnos a traves de nuestro formulario de contacto o en la direccion indicada en la pagina de contacto.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Datos que recopilamos</h2>
        <p>Recopilamos los siguientes datos personales cuando usted los proporciona voluntariamente:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nombre y apellidos</li>
          <li>Direccion de correo electronico</li>
          <li>Numero de telefono</li>
          <li>Datos relativos a citas y reservas</li>
        </ul>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Finalidad del tratamiento</h2>
        <p>Utilizamos sus datos personales para:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Gestionar sus citas y reservas</li>
          <li>Responder a sus consultas</li>
          <li>Enviar recordatorios de citas</li>
          <li>Mejorar nuestros servicios</li>
        </ul>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Base juridica</h2>
        <p>
          El tratamiento de sus datos se basa en su consentimiento expreso, otorgado al rellenar
          nuestros formularios y aceptar esta politica de privacidad.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Derechos del usuario</h2>
        <p>Tiene derecho a:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Acceder a sus datos personales</li>
          <li>Rectificar datos inexactos</li>
          <li>Solicitar la supresion de sus datos</li>
          <li>Oponerse al tratamiento</li>
          <li>Solicitar la portabilidad de sus datos</li>
        </ul>
        <p>
          Para ejercer estos derechos, contactenos a traves de nuestro formulario de contacto.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Conservacion de datos</h2>
        <p>
          Conservaremos sus datos personales durante el tiempo necesario para cumplir con las
          finalidades para las que fueron recogidos, y durante los plazos legalmente establecidos.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-text)]">Seguridad</h2>
        <p>
          Aplicamos medidas tecnicas y organizativas adecuadas para proteger sus datos personales
          contra el acceso no autorizado, la alteracion, divulgacion o destruccion.
        </p>

        <p className="text-xs text-[var(--color-text)]/40 pt-4">
          Ultima actualizacion: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>
    </div>
  );
}
