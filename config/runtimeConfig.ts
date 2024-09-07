import type { NuxtConfig } from "nuxt/schema";

export function createRuntimeConfig(): NuxtConfig["runtimeConfig"] {
  const config: NuxtConfig["runtimeConfig"] = {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    }
  };

  return config;
}
