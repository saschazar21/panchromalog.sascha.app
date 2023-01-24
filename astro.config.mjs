import { defineConfig } from "astro/config";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import lit from "@astrojs/lit";

// https://astro.build/config
import vitePwa from "@vite-pwa/astro";
import { manifest, seoConfig } from "./src/utils/manifest";

// https://astro.build/config
export default defineConfig({
  site: seoConfig.baseURL,
  output: "server",
  adapter: netlify(),
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    lit(),
    vitePwa({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
      manifest,
      workbox: {
        cleanupOutdatedCaches: true,
        globDirectory: "dist",
        globPatterns: [
          "**/*.{js,css,svg,png,jpg,jpeg,gif,avif,webp,woff,woff2,ttf,eot,ico}",
        ],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /\/_image/,
            handler: "CacheFirst",
          },
        ],
      },
    }),
  ],
});
