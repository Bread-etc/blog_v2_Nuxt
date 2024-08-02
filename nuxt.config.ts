import path from "path";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  alias: {
    "@": path.resolve(__dirname, "/"),
  },
  css: [
    "~/assets/styles/main.css", 
  ],
  app: {
    head: {
      title: "面包etc的博客",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
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
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
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
    // 关闭tailwindcss viewer服务
    viewer: false,
    configPath: "./tailwind.config.ts",
  }
})
