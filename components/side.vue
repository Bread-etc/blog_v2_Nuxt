<template>
  <div
    class="m-4 mb-0 mr-0 w-10 rounded-2xl bg-LightContent dark:bg-DarkContent"
    style="transition: all ease-in-out 0.4s !important"
  >
    <div class="flex flex-col items-center" style="height: calc(92vh - 0.5rem)">
      <div class="pt-4">
        <Avatar
          alt="avatar"
          :image="imageUrl"
          ariaLabel="avatar"
          class="bg-transparent p-[5px]"
          :pt="{
            image: {
              class: 'rounded-md',
            },
          }"
        />
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
            :aria-label="route.label"
            rounded
            iconClass="text-[20px]"
            style="
              transition: all ease-in-out 0.4s !important;
              border: 0;
              --tw-ring-color: none;
            "
            :pt="{
              root: {
                class: [
                  'bg-LightEm',
                  '!text-white',
                  'hover:bg-HoverLightEm',
                  'dark:bg-DarkEm',
                  'dark:hover:bg-HoverDarkEm',
                ],
              },
            }"
          />
        </NuxtLink>
      </div>
      <div class="mb-4 flex w-full flex-col items-center justify-center">
        <div class="mb-2 scale-[0.65]">
          <Button
            :icon="themeStore === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
            aria-label="darkModeToggle"
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
          class="scale-[0.65]"
        >
          <Button
            icon="pi pi-github"
            aria-label="Github"
            rounded
            severity="secondary"
            iconClass="text-[20px]"
            style="transition: all ease-in-out 0.4s !important; border: 0"
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
  { path: "/", icon: "pi pi-pencil", label: "index" },
  { path: "/contact", icon: "pi pi-at", label: "contact" },
  { path: "/about", icon: "pi pi-heart", label: "about" },
]);

/* 深色模式切换 */
const { system: _themeSystem, store: themeStore } = useColorMode();
const toggleColorMode = () => {
  themeStore.value = themeStore.value === "dark" ? "light" : "dark";
};
</script>
