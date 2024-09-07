import type { NuxtConfig } from "nuxt/schema";

export function appConfig(): NuxtConfig["app"] {
  const appConfig: NuxtConfig["app"] = {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    keepalive: true,
    head: {
      charset: 'utf-8',
      titleTemplate: "Bread_etc 's blog" || "%s",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  };

  return appConfig;
}
