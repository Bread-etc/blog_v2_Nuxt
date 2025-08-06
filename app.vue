<template>
  <div>
    <!-- 全局加载状态 -->
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Toaster />
  </div>
</template>

<script setup>
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";

useHead({
  titleTemplate: "%s - 面包etc的博客",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "记录学习与生活" },
  ],
});
</script>
