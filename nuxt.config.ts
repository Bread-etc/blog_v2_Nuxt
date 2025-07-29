export default defineNuxtConfig({
  css: [
    "assets/css/main.css",
    "assets/css/tailwind.css",
    "assets/css/transition.css",
  ],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  vueuse: {
    ssrHandlers: true,
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
