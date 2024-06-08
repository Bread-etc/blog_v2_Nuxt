// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {

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
    "primevue/resources/themes/aura-light-green/theme.css"
  ]
})
