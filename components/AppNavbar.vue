<template>
  <nav class="z-50 pt-2">
    <div class="flex-center mx-auto max-w-screen-xl">
      <!-- 主导航区域 - Dock 风格 -->
      <div
        class="flex-between w-full rounded-2xl border border-border px-4 py-1 shadow-lg backdrop-blur-md"
      >
        <div class="flex flex-1 items-center space-x-2">
          <NavLink to="/" icon="Box" label="首页" />
          <NavLink to="/posts" icon="Layers" label="博客" />
          <NavLink to="/categories" icon="Paperclip" label="分类" />
          <NavLink to="/tags" icon="Tag" label="标签" />
          <NavLink to="/about" icon="Github" label="关于" />
        </div>

        <div class="flex-between space-x-1">
          <Button
            @click="toggleTheme"
            variant="outline"
            class="group border-none bg-transparent p-2 outline-none ring-0 hover:bg-transparent"
          >
            <Sun
              v-if="isDark"
              class="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-primary"
            />
            <Moon
              v-else
              class="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-primary"
            />
          </Button>

          <Button
            variant="outline"
            class="group border-none bg-transparent p-2 outline-none ring-0 hover:bg-transparent"
          >
            <NuxtLink to="/login">
              <Settings
                class="h-4 w-4 text-foreground duration-300 group-hover:rotate-90"
              />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Sun, Moon, Settings } from "lucide-vue-next";
import Button from "./ui/button/Button.vue";

const { theme, toggleTheme } = useThemeTransition();
const isDark = computed(() => theme.value === "dark");
</script>
