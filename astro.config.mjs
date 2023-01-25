import { defineConfig } from "astro/config";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import lit from "@astrojs/lit";

// https://astro.build/config
import vitePwa from "@vite-pwa/astro";
import { manifest, seoConfig } from "./src/utils/manifest";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: seoConfig.baseURL,
  output: "server",
  adapter: vercel(),
  integrations: [image({
    serviceEntryPoint: "@astrojs/image/sharp"
  }), lit(), vitePwa({
    base: "/",
    scope: "/",
    devOptions: {
      enabled: true,
      type: "module"
    },
    filename: "sw.ts",
    injectManifest: {
      globPatterns: ["**/*.{js,css,svg,png,jpg,jpeg,gif,avif,webp,woff,woff2,ttf,eot,ico}"]
    },
    manifest,
    registerType: "autoUpdate",
    srcDir: "src/utils",
    strategies: "injectManifest"
  })]
});