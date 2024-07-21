<template>
  <div class="bg-LightContent dark:bg-DarkContent rounded-xl p-2" style="transition: all 0.4s ease-in-out !important;">
    <div class="dark:text-white">
      <Card style="transition: all .4s ease-in-out !important" class="bg-LightCard dark:DarkCard">
        <template #title>Simple Card</template>
        <template #content>
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
            numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse,
            cupiditate neque
            quas!
          </p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFetch } from '@vueuse/core';
import { onMounted } from 'vue';

const { isFetching, error, data } = await useFetch("https://admin.hastur23.top/api/getTagList")

onMounted(() => {
  console.log(JSON.parse(data.value as string));
})


</script>
