<template>
  <div>
    <NuxtLoadingIndicator color="var(--primary)" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Sonner :theme="theme" richColors />
  </div>
</template>

<script setup>
import "vue-sonner/style.css";

const theme = computed(() => useColorMode().value);

useHead({
  titleTemplate: "%s - 面包etc的博客",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "记录学习与生活" },
  ],
});
</script>
