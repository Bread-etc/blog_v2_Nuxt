<template>
  <div
    class="bg-LightContent dark:bg-DarkContent m-4 mr-0 h-full w-10 rounded-2xl"
    style="transition: all ease-in-out 0.4s !important"
  >
    <div class="flex h-[92vh] flex-col items-center">
      <div class="pt-4">
        <Avatar
          class="image"
          :image="imageUrl"
          style="padding: 5px; background: rgba(0, 0, 0, 0)"
        ></Avatar>
      </div>
      <div
        class="flex w-full flex-grow flex-col items-center justify-center space-y-4"
      >
        <NuxtLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          style="scale: 0.65"
        >
          <Button
            :icon="route.icon"
            rounded
            iconClass="text-[20px]"
            style="
              transition: all ease-in-out 0.4s !important;
              border: 0;
              --tw-ring-color: none;
            "
            class="bg-LightEm dark:bg-DarkEm hover:bg-HoverLightEm dark:hover:bg-HoverDarkEm text-white"
          />
        </NuxtLink>
      </div>
      <div class="mb-4 flex w-full flex-col items-center justify-center">
        <div class="mb-2" style="scale: 0.65">
          <Button
            :icon="themeStore === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
            rounded
            severity="secondary"
            :class="[
              'text-[20px]',
              { 'transition-all duration-500': themeStore },
            ]"
            style="
              transition: all ease-in-out 0.4s !important;
              border: 0;
              --tw-ring-color: none;
            "
            @click="toggleColorMode"
          />
        </div>
        <a
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          style="scale: 0.65"
        >
          <Button
            icon="pi pi-github"
            rounded
            severity="secondary"
            iconClass="text-[20px]"
            style="transition: all ease-in-out 0.4s !important; border: 0px"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";

/* 用户信息展示 */
const imageUrl: string =
  "https://www.freeimg.cn/i/2024/05/19/664a1a0f4b164.jpg";
const githubUrl: string = "https://github.com/Bread-etc";
const routes = ref<any[]>([
  { path: "/", icon: "pi pi-pencil" },
  { path: "/contact", icon: "pi pi-at" },
  { path: "/about", icon: "pi pi-heart" },
]);

/* 深色模式切换 */
const { system: themeSystem, store: themeStore } = useColorMode();
const toggleColorMode = () => {
  themeStore.value = themeStore.value === "dark" ? "light" : "dark";
};
</script>

<style scoped>
:deep(.image) {
  img {
    border-radius: 5px;
  }
}
</style>
