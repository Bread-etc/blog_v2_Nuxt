// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "面包etc的博客",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/public/favicon.ico" },
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
    // 全局样式表 [会进行打包处理]
    "./assets/styles/style.css",
    "primevue/resources/themes/aura-light-green/theme.css"
  ]
})
