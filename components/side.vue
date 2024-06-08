<template>
  <div class="flex flex-col rounded-lg relative" id="authorCard">
    <div class="flex flex-col justify-center py-4 mx-10">
      <Image :src="imageUrl" alt="Image" width="120" imageClass="rounded-xl" />
      <div class="mt-1 text-center text-lg font-bold">面包etc</div>
    </div>
    <ButtonGroup class="px-10 text-md flex justify-between">
      <Button
        v-for="route in routes"
        :icon="route.icon"
        class="font-bold text-md"
        @click="handleNavigate(route.path)"
      />
    </ButtonGroup>
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

#authorCard::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../assets/images/bg-authorCard.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  /* 调整模糊效果的程度 */
  z-index: 1;
  /* 确保背景层在文字后面 */
}

#authorCard > * {
  position: relative;
  z-index: 10;
}
</style>
