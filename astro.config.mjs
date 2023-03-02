import { defineConfig } from "astro/config";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import vitePwa from "@vite-pwa/astro";
import { manifest } from "./src/utils/manifest";

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:3000",
  output: "server",
  adapter: netlify(),
  integrations: [
    preact({
      compat: true,
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    vitePwa({
      base: "/",
      scope: "/",
      devOptions: {
        enabled: true,
        type: "module",
      },
      filename: "sw.ts",
      injectManifest: {
        globPatterns: [
          "**/*.{js,css,svg,png,jpg,jpeg,gif,avif,webp,woff,woff2,ttf,eot,ico}",
        ],
      },
      manifest,
      registerType: "autoUpdate",
      srcDir: "src/utils",
      strategies: "injectManifest",
    }),
  ],
  vite: {
    define: {
      "process.env.IMAGEKIT_ID": JSON.stringify(process.env.IMAGEKIT_ID),
      "process.env.FAUNA_GRAPHQL_HOST": JSON.stringify(
        process.env.FAUNA_GRAPHQL_HOST
      ),
      "process.env.FAUNA_KEY": JSON.stringify(process.env.FAUNA_KEY),
    },
  },
});
