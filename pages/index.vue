<template>
  <div>
    <Floating />
  </div>
</template>

<script lang="ts" setup>
const { data } = await useFetch(
  "https://admin.hastur23.top/api/getTagList"
)


onMounted(() => {
  console.log(unref(data));
});
</script>
