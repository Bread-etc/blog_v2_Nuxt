import { NuxtConfig } from "nuxt/schema";

export function appConfig(): NuxtConfig["app"] {
  const appConfig: NuxtConfig["app"] = {
    pageTransition: { name: "page", mode: "out-in" },
    keepalive: true,
    head: {
      title: "bread_etc 's blog",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-webfont/1.6.0/style.min.css",
        },
      ],
    },
  };

  return appConfig;
}
