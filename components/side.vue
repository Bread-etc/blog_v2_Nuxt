<template>
  <div class="flex flex-col rounded-lg">
  </div>
</template>

<script lang="ts" setup>
import Image from "primevue/image";
import ButtonGroup from "primevue/buttongroup";
import Button from "primevue/button";

const imageUrl: string =
  "https://www.freeimg.cn/i/2024/05/19/664a1a0f4b164.jpg";
const router = useRouter();
const routes = ref([
  { path: "/", icon: "pi pi-pencil" },
  { path: "/contact", icon: "pi pi-megaphone" },
  { path: "/about", icon: "pi pi-heart" },
]);

const handleNavigate = (path: string): void => {
  router.push(path);
};

const websiteButtons = ref([]);
</script>

<style scoped>
#authorCard {
  position: relative;
  overflow: hidden;
  /* 确保模糊背景不会溢出 */
  height: 95vh;
}
</style>
