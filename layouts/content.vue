<template>
  <div
    class="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-lightOutBgImage dark:bg-darkOutBgImage lg:px-4"
  >
    <div
      class="flex h-[100vh] w-[70%] max-w-screen-xl flex-col items-center justify-center bg-LightBg transition-all duration-300 ease-in-out dark:bg-DarkBg lg:h-[98vh] lg:rounded-xl"
    >
      <div class="flex w-full">
        <aside>
          <Side />
        </aside>
        <main class="m-4 mb-0 flex-1 w-0">
          <NuxtLoadingIndicator />
          <NuxtPage class="h-[92vh]"></NuxtPage>
        </main>
      </div>
    </div>
  </div>
</template>
