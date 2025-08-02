export default defineNuxtConfig({
  compatibilityDate: "2025-08-03",
  css: ["assets/css/main.css", "assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  vueuse: {
    ssrHandlers: true,
  },

  // --- 组件配置 ---
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/ui",
      extensions: [".vue"],
      prefix: "Ui",
      pathPrefix: false,
    },
  ],

  // --- tailwindcss 配置 ---
  tailwindcss: {
    viewer: false,
  },

  // --- 运行时配置
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API,
    },
  },

  // --- 后端服务器配置 ---
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
});
