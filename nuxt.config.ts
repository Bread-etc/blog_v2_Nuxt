// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: "stylesheet", href: "https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.6.0/style.min.css" },
      ]
    }
  },
  devServer: { port: 3030 },
  devtools: { enabled: true },
  // 模块
  modules: [
    "nuxt-primevue",
    "@nuxtjs/tailwindcss",
  ],
  primevue: {
    usePrimeVue: true,
    /* options */
    options: {
      unstyled: true,
      ripple: true,
      inputStyle: 'filled'
    }
  },
  css: [
    "./assets/styles/style.css",
    "primevue/resources/themes/aura-light-green/theme.css"
  ]
})
