<template>
  <div
    class="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-lightOutBgImage dark:bg-darkOutBgImage lg:px-4"
  >
    <Toast />
    <div
      class="bg-LightBg dark:bg-DarkBg flex h-[100vh] w-[70%] max-w-screen-xl items-center justify-center transition-all duration-300 ease-in-out lg:h-[98vh] lg:rounded-xl"
    >
      <aside>
        <Side />
      </aside>
      <main class="m-4 flex-1">
        <NuxtPage keepalive class="h-[92vh]"></NuxtPage>
      </main>
    </div>
  </div>
</template>