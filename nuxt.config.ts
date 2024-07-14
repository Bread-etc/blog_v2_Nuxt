import path from "path";

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
    "nuxt-primevue",
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
    config: {
      darkMode: 'class',
      content: [
        "presets/**/*.{js,vue,ts}" // this is optional if you are using @nuxtjs/tailwindcss
      ],
      theme: {
        extend: {
          colors: {
            primary: 'rgb(var(--primary))',
            'primary-inverse': 'rgb(var(--primary-inverse))',
            'primary-hover': 'rgb(var(--primary-hover))',
            'primary-active-color': 'rgb(var(--primary-active-color))',

            'primary-highlight': 'rgb(var(--primary)/var(--primary-highlight-opacity))',
            'primary-highlight-inverse': 'rgb(var(--primary-highlight-inverse))',
            'primary-highlight-hover': 'rgb(var(--primary)/var(--primary-highlight-hover-opacity))',

            'primary-50': 'rgb(var(--primary-50))',
            'primary-100': 'rgb(var(--primary-100))',
            'primary-200': 'rgb(var(--primary-200))',
            'primary-300': 'rgb(var(--primary-300))',
            'primary-400': 'rgb(var(--primary-400))',
            'primary-500': 'rgb(var(--primary-500))',
            'primary-600': 'rgb(var(--primary-600))',
            'primary-700': 'rgb(var(--primary-700))',
            'primary-800': 'rgb(var(--primary-800))',
            'primary-900': 'rgb(var(--primary-900))',
            'primary-950': 'rgb(var(--primary-950))',

            'surface-0': 'rgb(var(--surface-0))',
            'surface-50': 'rgb(var(--surface-50))',
            'surface-100': 'rgb(var(--surface-100))',
            'surface-200': 'rgb(var(--surface-200))',
            'surface-300': 'rgb(var(--surface-300))',
            'surface-400': 'rgb(var(--surface-400))',
            'surface-500': 'rgb(var(--surface-500))',
            'surface-600': 'rgb(var(--surface-600))',
            'surface-700': 'rgb(var(--surface-700))',
            'surface-800': 'rgb(var(--surface-800))',
            'surface-900': 'rgb(var(--surface-900))',
            'surface-950': 'rgb(var(--surface-950))'
          }
        }
      }
    }
  }
})
