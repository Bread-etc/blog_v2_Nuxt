import Aura from "@primevue/themes/aura";
import { fileURLToPath } from "url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  alias: {
    model: fileURLToPath(new URL("./api/model", import.meta.url))
  },
  css: ["assets/styles/main.css"],
  typescript: {
    shim: false,
    strict: true,
  },
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
});
