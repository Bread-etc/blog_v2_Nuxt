import path from "path";
import Aura from "@primevue/themes/aura";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  alias: {
    "#": path.resolve(__dirname, "/api"),
    "@": path.resolve(__dirname, "/"),
  },
  css: ["~/assets/styles/main.css"],
  app: {
    head: {
      title: "面包etc的博客",
      meta: [
        { charset: "utf-8" },
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
  // 运行时配置
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  // 如果存在跨域
  nitro: {
    devProxy: {
      "/api": {
        target: process.env.NUXT_PUBLIC_API_BASE,
        changeOrigin: true,
      },
    },
  },
  devServer: { port: 3030 },
  devtools: { enabled: false },

  /**
   * 各模块配置项
   */
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "nuxt-lodash",
  ],
  // primevue 组件库
  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
      theme: {
        preset: Aura,
        options: {
          prefix: "Prime",
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },
  // tailwindcss 配置项
  tailwindcss: {
    viewer: false,
    configPath: "./tailwind.config.ts",
  },
  // 持久化存储
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
    storage: "localStorage",
  },
  // lodash 配置项 [https://nuxtjs.org.cn/modules/lodash]
  lodash: {
    prefix: "use",
    prefixSkip: ["string"],
  },
});
