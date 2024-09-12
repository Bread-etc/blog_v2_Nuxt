<template>
  <Dialog
    v-model:visible="isShow"
    modal
    class="w-1/2 !border-none dark:bg-DarkBg dark:text-white"
  >
    <template #header>
      <h1 class="text-lg font-semibold">站点信息</h1>
    </template>
    <div class="grid grid-cols-4 gap-4 py-2">
      <div
        class="flex transform flex-col items-center justify-center rounded-lg bg-gray-100 p-4 transition-transform hover:-translate-y-1"
      >
        <i class="pi pi-bookmark mb-4 text-4xl text-blue-500"></i>
        <p class="text-lg font-bold text-gray-700">文章数: {{ article }}</p>
      </div>
      <div
        class="flex transform flex-col items-center justify-center rounded-lg bg-gray-100 p-4 transition-transform hover:-translate-y-1"
      >
        <i class="pi pi-tags mb-4 text-4xl text-blue-500"></i>
        <p class="text-lg font-bold text-gray-700">标签数: {{ tagsNum }}</p>
      </div>
      <div
        class="flex transform flex-col items-center justify-center rounded-lg bg-gray-100 p-4 transition-transform hover:-translate-y-1"
      >
        <i class="pi pi-eye mb-4 text-4xl text-blue-500"></i>
        <p class="text-lg font-bold text-gray-700">浏览量: {{ viewers }}</p>
      </div>
      <div
        class="flex transform flex-col items-center justify-center rounded-lg bg-gray-100 p-4 transition-transform hover:-translate-y-1"
      >
        <i class="pi pi-comment mb-4 text-4xl text-blue-500"></i>
        <p class="text-lg font-bold text-gray-700">评论数: {{ comments }}</p>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
const isShow = ref(false);

const article = ref(1);
const viewers = ref(1);
const tagsNum = ref(1);
const comments = ref(1);

// 定义打开方法
const open = () => {
  isShow.value = true;
};
// 暴露给父组件
defineExpose({ open });
</script>
