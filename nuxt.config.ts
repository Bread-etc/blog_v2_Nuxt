import Aura from "@primevue/themes/aura";
import { fileURLToPath } from "url";
import {
  appConfig,
  createNitroConifg,
  createRuntimeConfig,
  seoConfig,
  createViteConfig,
} from "./config";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  typescript: {
    shim: false,
    strict: true,
  },
  alias: {
    model: fileURLToPath(new URL("./api/model", import.meta.url)),
  },
  css: ["assets/styles/main.css"],
  app: appConfig(),
  runtimeConfig: createRuntimeConfig(),
  nitro: createNitroConifg(),
  vite: createViteConfig(),
  site: seoConfig(),
  devServer: { port: 3030 },
  devtools: { enabled: false },

  robots: {
    disallow: ["/secret", "/admin"],
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-lodash",
    "@prisma/nuxt",
    "@nuxt/content",
    "@nuxtjs/seo",
  ],

  tailwindcss: {
    viewer: false,
    configPath: "./tailwind.config.ts",
  },

  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
      theme: {
        preset: Aura,
        options: {
          preset: "Prime",
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },

  vueuse: {
    ssrHandlers: true,
  },

  lodash: {
    prefix: "use",
    prefixSkip: ["string"],
  },

  content: {
    watch: false,
    markdown: {
      mdc: false,
      toc: { depth: 3, searchDepth: 3 },
    },
    highlight: {
      theme: {
        default: "dracula-soft",
      },
      langs: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx",
        "vue",
        "css",
        "html",
        "bash",
        "md",
        "c++",
        "go",
        "sql",
        "java",
      ],
    },
  },

  image: {
    format: ["webp", "jpg", "png"],
  },

  prisma: {
    installStudio: false,
  },

  compatibilityDate: "2024-08-09",
});
