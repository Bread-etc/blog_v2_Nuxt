// 配置nitro服务端
import type { NuxtConfig } from "@nuxt/schema";

export function createNitroConifg(): NuxtConfig["nitro"] {
  const config: NuxtConfig["nitro"] = {
    // 服务器主要URL
    baseURL: "/",

    database: {
      default: {
        connector: "postgresql",
        options: {
          url: "postgresql://postgresql:Gzk118348@localhost:5432/blogDatabase",
        },
      },
    },
  };

  return config;
}
