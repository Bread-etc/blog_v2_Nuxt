export default defineNuxtConfig({
  compatibilityDate: "2025-08-03",
  css: ["assets/css/main.css", "assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@pinia/nuxt"],
  colorMode: {
    classSuffix: "",
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
      prefix: "",
      pathPrefix: false,
    },
  ],

  // --- tailwindcss 配置 ---
  tailwindcss: {
    viewer: false,
  },

  // --- 开发服务器配置 ---
  devServer: {
    port: 3000,
  },

  // --- vite 配置 ---
  vite: {
    server: {
      hmr: {
        port: 24678,
        overlay: true,
      },
      watch: {
        usePolling: true,
        interval: 200,
      },
    },
    optimizeDeps: {
      include: ["vue", "@vueuse/core", "pinia"],
    },
  },

  // --- build 打包配置 ---
  build: {
    analyze: false,
  },

  // --- 运行时配置 ---
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
