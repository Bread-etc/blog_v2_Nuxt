<template>
  <div
    class="m-4 mr-0 bg-LightContent dark:bg-DarkContent h-full w-10 rounded-2xl"
    style="transition: all ease-in-out 0.4s !important"
  >
    <div class="flex flex-col items-center h-[95vh]">
      <div class="pt-4">
        <Avatar
          size="normal"
          :image="imageUrl"
          style="padding: 5px; background: rgba(0, 0, 0, 0)"
        ></Avatar>
      </div>
      <div
        class="flex-grow flex flex-col justify-center items-center w-full space-y-4"
      >
        <NuxtLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="w-[68%]"
        >
          <Button
            :icon="route.icon"
            rounded
            iconClass="text-[14px]"
            style="
              padding: 3px;
              width: 100%;
              transition: all ease-in-out 0.4s !important;
              border: 0;
            "
            class="text-white bg-LightEm dark:bg-DarkEm"
          />
        </NuxtLink>
      </div>
      <div class="flex flex-col justify-center items-center w-full mb-4">
        <div class="mb-2 w-[68%]">
          <Button
            :icon="themeStore === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
            rounded
            severity="secondary"
            :class="[
              'text-[14px]',
              { 'transition-all duration-500': themeStore },
            ]"
            style="
              padding: 7px;
              width: 100%;
              transition: all ease-in-out 0.4s !important;
            "
            @click="toggleColorMode"
          />
        </div>
        <a
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-[68%]"
        >
          <Button
            icon="pi pi-github"
            rounded
            severity="secondary"
            iconClass="text-[18px]"
            style="
              padding: 3px;
              width: 100%;
              transition: all ease-in-out 0.4s !important;
            "
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
