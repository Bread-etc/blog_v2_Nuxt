import Aura from "@primevue/themes/aura";
import { fileURLToPath } from "url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    keepalive: true,
    head: {
      title: "bread_etc 's blog",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.6.0/style.min.css",
        },
      ],
    },
  },

  typescript: {
    shim: false,
    strict: true,
  },

  alias: {
    model: fileURLToPath(new URL("./api/model", import.meta.url)),
  },

  css: ["assets/styles/main.css"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  devServer: { port: 3030 },
  devtools: { enabled: false },

  // 模块配置项
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-lodash",
  ],

  tailwindcss: {
    /* 配置项 */
    viewer: false,
    configPath: "./tailwind.config.ts",
  },

  primevue: {
    /* 配置项 */
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
    /* 配置项 */
    ssrHandlers: true,
  },

  piniaPersistedState: {
    cookieOptions: {
      // 30 天过期
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    },
    storage: "localStorage",
  },

  lodash: {
    /* 配置项 */
    prefix: "use",
    prefixSkip: ["string"],
  },

  compatibilityDate: "2024-08-09",
});
