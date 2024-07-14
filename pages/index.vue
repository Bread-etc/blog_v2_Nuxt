<template>
  <div class="bg-LightContent dark:bg-DarkContent rounded-xl" style="transition: all 0.4s ease-in-out !important;">
    index
  </div>
</template>

<script lang="ts" setup>
import { useFetch } from '@vueuse/core';
import { onMounted, unref } from 'vue';

const { isFetching, error, data } = await useFetch("https://admin.hastur23.top/api/getTagList")

onMounted(() => {
  console.log(JSON.parse(data.value as string));
})


</script>
