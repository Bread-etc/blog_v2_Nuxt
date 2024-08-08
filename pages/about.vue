<template>
  <div class="p-4 dark:text-white">
    about
    <button @click="getList()">点击我getList</button>
  </div>
</template>

<script lang="ts" setup>
import type { BlogInfo } from "../api/model/BlogInfo";
import { useApi } from "../composables/index";

const { blogInfo } = useApi();

async function getList() {
  const data: BlogInfo = await blogInfo.getList();
  console.log(data);
}
</script>

<style scoped></style>
