<template>
  <div class="flex justify-center items-center h-screen">
    <Side class="px-8 py-2 mr-1"></Side>
    <div class="px-4 py-2 flex-1 rounded-lg max-w-2xl" id="nuxtPage">
      <NuxtPage></NuxtPage>
    </div>
  </div>
</template>

<style>
#nuxtPage {
  height: 95vh;
}
</style>
