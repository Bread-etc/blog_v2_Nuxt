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
  devServer: { port: 3030 },
  devtools: { enabled: false },
  build: {
    // 构建添加编译 jsencrypt
    transpile: ["jsencrypt"],
    // 打包分析
    analyze: true,
  },
  site: seoConfig(),
  robots: {
    disallow: ["/secret", "/admin"],
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
    "@nuxt/content",
    "@nuxt/image",
    "@nuxtjs/seo",
  ],

  tailwindcss: {
    /* 配置项 */
    viewer: false,
    configPath: "tailwind.config.ts",
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

  lodash: {
    /* 配置项 */
    prefix: "use",
    prefixSkip: ["string"],
  },

  content: {
    /* 配置项 */
    watch: false,
    markdown: {
      mdc: false,
      /* 目录深度配置 */
      toc: { depth: 3, searchDepth: 3 },
    },
    /* 高亮配置 */
    highlight: {
      theme: {
        default: "dracula",
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
    /* 配置项 */
    installStudio: false, // 关闭每次询问安装studio
  },

  compatibilityDate: "2024-08-09",
});
