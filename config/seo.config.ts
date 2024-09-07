import type { NuxtConfig } from "nuxt/schema";

export function seoConfig(): NuxtConfig["site"] {
  const seoConfig: NuxtConfig["site"] = {
    url: "https://hastur23.top",
    title: "Bread_etc's blog",
    description: "面包etc的个人博客",
    defaultLocale: "zh-CN",
    exclude: ["/admin/**"],
    cacheMaxAgeSeconds: 24 * 3600,
    autoLastmod: true,
  };
  return seoConfig;
}
