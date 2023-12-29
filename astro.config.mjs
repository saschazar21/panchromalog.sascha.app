import { defineConfig } from "astro/config";

// https://astro.build/config
import vitePwa from "@vite-pwa/astro";
import { manifest } from "./src/utils/manifest";

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

import svgr from "vite-plugin-svgr";

const define = Object.fromEntries(
  Object.keys(process.env).map((key) => [
    `process.env.${key}`,
    JSON.stringify(process.env[key]),
  ])
);

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  output: "server",
  adapter: netlify(),
  integrations: [
    preact({
      compat: true,
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
    define,
    plugins: [svgr()],
  },
});
