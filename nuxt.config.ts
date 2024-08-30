import Aura from "@primevue/themes/aura";
import { fileURLToPath } from "url";
import { appConfig, createNitroConifg, createRuntimeConfig } from "./config";
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
  devServer: { port: 3030 },
  devtools: { enabled: false },
  build: {
    // 构建添加编译 jsencrypt
    transpile: ["jsencrypt"],
  },
  dir: {
    public: "uploads",
  },

  // 模块配置项
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-lodash",
    "@prisma/nuxt",
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
      // 7 天过期
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    },
  },

  lodash: {
    /* 配置项 */
    prefix: "use",
    prefixSkip: ["string"],
  },

  compatibilityDate: "2024-08-09",
});
