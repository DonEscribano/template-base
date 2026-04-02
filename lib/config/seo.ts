import type { Metadata } from "next";
import { siteConfig } from "./site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} — sitio web oficial`,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: `${siteConfig.name} — sitio web oficial`,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: `${siteConfig.name} — sitio web oficial`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
