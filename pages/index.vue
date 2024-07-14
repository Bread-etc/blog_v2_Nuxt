<template>
  <div class="bg-white dark:bg-black">
    index
  </div>
</template>

<script lang="ts" setup>
import { onMounted, unref } from 'vue';

const { data } = await useFetch(
  "https://admin.hastur23.top/api/getTagList"
)


onMounted(() => {
  console.log(unref(data));
});
</script>
