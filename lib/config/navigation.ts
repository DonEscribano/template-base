export interface NavLink {
  label: string;
  href: string;
}

export function getNavLinks(): NavLink[] {
  return [
    { label: "Home", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Equipo", href: "/equipo" },
    { label: "Reservas", href: "/reservas" },
    { label: "Contacto", href: "/contacto" },
  ];
}
