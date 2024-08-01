<template>
  <div
    class="bg-transparent rounded-xl px-2 pb-2 flex"
    style="transition: all 0.4s ease-in-out !important"
  >
    <div class="dark:text-white flex-1 h-[92vh] rounded-xl overflow-auto">
      <template v-if="hasData">
        <Card
          v-for="(item, _index) in items"
          class="transition-all duration-700 ease-in-out bg-LightContent dark:bg-DarkContent mb-3 h-[22vh]"
          v-animateonscroll="{ enterClass: 'animate-fadeinright', leaveClass: 'animate-fadeoutright' }" 
        >
          <template #title>{{ item.title }}</template>
          <template #content>
            <p class="m-0 overflow-hidden text-ellipsis cardCut">
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
  {
    title: "1",
    content:
      "dfasdfsafdsafdsafdsafdsafdsafdsafdsfdsafdsafdsfsda fsda123f1d6s5 a1fd651 f65dsa 146f5d4 fds56af4 ds654f 65ds4f 654ds 65dsa4f65ds f65dsa4f65 ds65f4 as56df1d6sa f1ds5a64f d5sa64f1 65d1f 65dsa4f65ds4 f65d1acv65d4f65d4 f65ds1f652df4gdf dslfjhdsklajf l;ksjf lkd aflkw fokl fj;okdu f0io2j fvkcaof jdlig jaeropi;'fvj'fdsag jd'ug f2w4ipejfvds;lkajgfdsasasasasasafdasfsadfdsafksad;f sdla; fdslkf ds fds fdsalkf dsfldlfsaf dsals fdskla;fj lkdsfjsdalk;fsdklaflkjsda",
  },
  {
    title: "2",
    content: "content",
  },
  {
    title: "3",
    content: "content",
  },
  {
    title: "4",
    content: "content",
  },
  {
    title: "5",
    content: "content",
  },
  {
    title: "6",
    content: "content",
  },
  {
    title: "7",
    content: "content",
  },
  {
    title: "8",
    content: "content",
  },
  {
    title: "9",
    content: "content",
  },
  {
    title: "xxx",
    content: "xxx",
  },
]);

onMounted(() => {
  setTimeout(() => {
    hasData.value = !hasData.value;
  }, 1000);
});
</script>

<style>
.cardCut {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
