import type { ManifestOptions } from "vite-plugin-pwa";
import pkg from "../../package.json";

export const seoConfig = {
  baseURL: import.meta.env.VERCEL_URL
    ? `https://${import.meta.env.VERCEL_URL}`
    : "http://localhost:3000",
};

export const manifest: Partial<ManifestOptions> = {
  name: pkg.short_name,
  short_name: pkg.short_name,
  description: pkg.description,
  theme_color: pkg.color,
  background_color: "#E9ECEF",
  display: "standalone",
  icons: [
    {
      src: "/img/rounded-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/img/rounded-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/img/maskable-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/img/maskable-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
