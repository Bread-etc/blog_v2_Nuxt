import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  typescript: {
    shim: false,
    strict: true,
  },
  app: {
    keepalive: true,
    head: {
      charset: "utf-8",
      titleTemplate: "Bread_etc 's blog" || "%s",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  css: ["assets/styles/main.css", "assets/styles/transition.css"],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API,
    },
  },

  nitro: {
    compressPublicAssets: {
      gzip: true
    }
  },

  modules: [
    "nuxt-lodash",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    '@nuxt/content',
  ],

  lodash: {
    prefix: "use",
    prefixSkip: ["string"],
  },

  tailwindcss: {
    viewer: false,
    configPath: "./tailwind.config.ts",
  },

  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
      theme: {
        preset: Aura,
        options: {
          preset: "Prime",
          darkModeSelectors: "system",
          cssLayer: false,
        },
      },
    },
  },

  vueuse: {
    ssrHandlers: true,
  },

  content: {
    watch: false,
    markdown: {
      mdc: false,
      toc: { depth: 3, searchDepth: 3 },
    },
    highlight: {
      theme: {
        default: "dracula-soft",
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
});
