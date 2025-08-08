<template>
  <div class="flex-center">
    <NuxtLink
      :to="to"
      class="group flex items-center space-x-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-accent"
      :class="{
        'bg-primary text-primary-foreground hover:bg-primary': isActive,
        'text-muted-foreground hover:text-foreground': !isActive,
      }"
    >
      <component :is="iconComponent" class="h-4 w-4" />
      <span class="hidden md:block">{{ label }}</span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { Tag, Box, Layers, Paperclip, Github } from "lucide-vue-next";

const props = defineProps({
  to: String,
  icon: String,
  label: String,
});

const route = useRoute();
const isActive = computed(() => {
  if (props.to === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(props.to);
});

const iconComponents = {
  Box,
  Layers,
  Paperclip,
  Tag,
  Github,
};

const iconComponent = computed(() => iconComponents[props.icon]);
</script>
