<template>
  <div class="flex rounded-xl bg-transparent p-4">
    <div
      class="flex h-[92vh] flex-1 flex-col overflow-auto rounded-xl dark:text-white"
    >
      <h1 class="text-2xl">欢迎来到我的留言板 👋</h1>
      <span class="py-1"
        >经 Github 登录后,在下方的留言框中输入您的留言内容即可</span
      >
      <span class="py-1">评论区支持markdown和emoji😘</span>
      <span class="py-1">本站内容仅供学习参考使用</span>
      <Divider />
      <div ref="commentRef" id="comment"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const commentRef = ref<HTMLElement | null>(null);
onMounted(() => {
  try {
    if (commentRef.value) {
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.setAttribute("repo", "Bread-etc/blog_v2_Nuxt");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "💬comment");
      script.setAttribute("theme", "preferred-color-scheme");
      commentRef.value.appendChild(script);
    } else {
      console.warn(
        "Comments won't load because the commentRef element is null.",
      );
    }
  } catch (err) {
    console.error("Comments loading failed.", err);
  }
});
</script>

<style scoped>
:deep(#comment) {
  .utterances {
    max-width: none;
  }
}

:deep(Divider)::before {
  @apply border-black dark:border-white /* 轻模式下为黑色，暗模式下为白色 */
}
</style>
