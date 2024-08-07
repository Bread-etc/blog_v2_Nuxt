<template>
  <div class="bg-transparent rounded-xl px-2 pb-2 flex">
    <div class="flex-1 h-[92vh] rounded-xl overflow-auto">
      <template v-if="hasData">
        <Card
          v-for="(item, _index) in items"
          class="bg-LightContent dark:bg-DarkContent mb-3 h-[22vh] dark:text-white"
          v-animateonscroll="{
            enterClass: 'animate-fadeinright',
            leaveClass: 'animate-fadeoutright',
          }"
          style="transition: all ease-in-out 0.5s !important"
        >
          <template #title>{{ item.title }}</template>
          <template #content>
            <p class="m-0 cardCut">
              {{ item.content }}
            </p>
          </template>
        </Card>
      </template>
      <template v-else> </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const hasData = ref<boolean>(false);

const items = ref([
  { title: "1", content: "content" },
  { title: "2", content: "content" },
  { title: "3", content: "content" },
  { title: "4", content: "content" },
  { title: "5", content: "content" },
  { title: "6", content: "content" },
  { title: "7", content: "content" },
  { title: "8", content: "content" },
  { title: "9", content: "content" },
  { title: "xxx", content: "xxx" },
]);

const data = ref([
  { title: "a", content: "A" },
  { title: "b", content: "B" },
]);

onMounted(() => {
  hasData.value = true;
});
</script>

<style scoped>
.cardCut {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  line-clamp: 3;
}
</style>
