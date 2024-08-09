<template>
  <div class="p-4 dark:text-white">
    about
    <button @click="getList()">点击我getList</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import type { BlogInfo } from "../api/model/BlogInfo";
import { useApi } from "../composables/index";

const { blogInfo } = useApi();

async function getList() {
  const data: BlogInfo = await blogInfo.getList();
  console.log(data);
}

onMounted(async () => {
  try {
    const data = await blogInfo.getList();
    console.log('数据:', data);
  } catch (error) {
    console.error('请求失败:', error);
  }
});
</script>

<style scoped></style>
