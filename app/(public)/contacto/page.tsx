import { Contact } from "@/components/sections/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con nosotros. Estamos aqui para ayudarte.",
};

export default function ContactoPage() {
  return (
    <Contact
      email="info@ejemplo.es"
      phone="+34 928 000 000"
      address="Calle Ejemplo 1, Las Palmas de Gran Canaria"
    />
  );
}
