<template>
  <div>
    <!-- 全局加载状态 -->
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- 全局通知组件 -->
  </div>
</template>

<script setup>
useHead({
  titleTemplate: "%s - 面包etc的博客",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "记录学习与生活" },
  ],
});
</script>
