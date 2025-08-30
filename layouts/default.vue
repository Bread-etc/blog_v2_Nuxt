<template>
  <div class="min-h-screen bg-background">
    <div class="mx-auto max-w-screen-lg">
      <AppNavbar />
      <section class="py-8">
        <slot name="hero">
          <!-- 默认页面介绍 -->
          <div class="text-center">
            <h1 class="text-xl font-bold">欢迎来到我的博客</h1>
            <p class="mx-auto max-w-2xl text-sm text-muted-foreground">
              分享学习与生活
            </p>
          </div>
        </slot>
      </section>

      <main class="pb-16">
        <NuxtPage />
      </main>

      <footer class="border-t border-border">
        <div class="mx-auto max-w-xl px-8 py-2">
          <div
            class="cursor-pointer select-none text-center text-xs duration-300 ease-in-out hover:text-primary"
          >
            <a href="https://beian.miit.gov.cn/" target="_blank"
              >备案号: 粤ICP备2023050288号-1</a
            >
            <a href="https://github.com/Bread-etc" target="_blank" class="ml-2"
              >&copy;&nbsp;2024-2025 By Bread_etc
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: "%s",
  meta: [
    { name: "description", content: "一个专注于技术分享的个人博客" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
});
</script>
