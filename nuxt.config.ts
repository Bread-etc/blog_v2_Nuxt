import path from "path";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  alias: {
    "@": path.resolve(__dirname, "/"),
  },
  css: ["~/assets/styles/main.css"],
  app: {
    head: {
      title: "面包etc的博客",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/assets/images/favicon.ico" },
        { rel: "stylesheet", href: "https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.6.0/style.min.css" },
      ]
    }
  },
  devServer: { port: 3030 },
  devtools: { enabled: false },
  // 模块
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  primevue: {
    options: {
      unstyled: true,
      ripple: true,
      inputStyle: "filled"
    },
    importPT: { from: path.resolve(__dirname, "./presets/aura/") },
    components: {
      exclude: ["Editor", "Chart"]
    }
  },
  tailwindcss: {
    configPath: "./tailwind.config.ts"
  },
  // 添加运行时配置
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || SERVER_BASE_API,
    }
  }
})
