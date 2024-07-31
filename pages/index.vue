<template>
  <div
    class="bg-transparent rounded-xl p-2"
    style="transition: all 0.4s ease-in-out !important"
  >
    <div class="dark:text-white">
      <Card
        v-for="item in cardList"
        class="transition-all duration-400 ease-in-out bg-LightContent dark:bg-DarkContent mb-3"
      >
        <template #title>{{ item.title }}</template>
        <template #content>
          <p class="m-0">{{ item.content }}</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFetch } from "@vueuse/core";
import { onMounted, ref } from "vue";

const { isFetching, error, data } = await useFetch(
  "https://admin.hastur23.top/api/getTagList"
);

const cardList = ref<any[]>([
  { title: "1", content: "content" },
  { title: "2", content: "content" },
  { title: "3", content: "content" },
  { title: "4", content: "content" },
  { title: "5", content: "content" },
  { title: "6", content: "content" },
  { title: "7", content: "content" },
  { title: "8", content: "content" },
  { title: "9", content: "content" },
]);

onMounted(() => {
  console.log(JSON.parse(data.value as string));
});
</script>
