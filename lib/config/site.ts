export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Mi Negocio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000",
  get domain(): string {
    try {
      return new URL(this.url).hostname;
    } catch {
      return "localhost";
    }
  },
} as const;
