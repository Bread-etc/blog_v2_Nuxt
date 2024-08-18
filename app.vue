<template>
  <!-- <NuxtLoadingIndicator style="position: absolute; width: 100vw; height: 50px" /> -->
  <NuxtLayout>
    <div>
      <NuxtPage class="h-[92vh]"></NuxtPage>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "default",
});
</script>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>
