// 配置nitro服务端
import type { NuxtConfig } from "@nuxt/schema";

export function createNitroConifg(): NuxtConfig["nitro"] {
  const config: NuxtConfig["nitro"] = {
    // 服务器主要URL
    baseURL: "/",
    // 插件配置
    // plugins: ["../server/plugins"],
  };

  return config;
}
