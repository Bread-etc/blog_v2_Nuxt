<template>
  <div class="m-4 mr-0 bg-white h-full w-10 rounded-2xl">
    <div class="flex flex-col items-center h-[95vh]">
      <div class="pt-4">
        <Avatar size="normal" :image="imageUrl" style="padding: 5px; background: rgba(0, 0, 0, 0)"></Avatar>
      </div>
      <div class="flex-grow flex flex-col justify-center items-center w-full space-y-4">
        <NuxtLink v-for="route in routes" :key="route.path" :to="route.path" class="w-[68%]">
          <Button :icon="route.icon" rounded severity="secondary" iconClass="text-[13px]"
            style="padding: 3px; width: 100%" />
        </NuxtLink>
      </div>
      <div class="flex flex-col justify-center items-center w-full mb-4">
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="w-[68%]">
          <Button icon="pi pi-github" rounded severity="contrast" iconClass="text-[18px]"
            style="padding: 3px; width: 100%" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const imageUrl: string =
  "https://www.freeimg.cn/i/2024/05/19/664a1a0f4b164.jpg";
const githubUrl: string = "https://github.com/Bread-etc";
const routes = ref([
  { path: "/", icon: "pi pi-pencil" },
  { path: "/contact", icon: "pi pi-at" },
  { path: "/about", icon: "pi pi-heart" },
]);
</script>
