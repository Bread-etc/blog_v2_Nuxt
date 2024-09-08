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
        <main class="m-4 mb-0 flex-1">
          <NuxtLoadingIndicator />
          <NuxtPage class="h-[92vh]"></NuxtPage>
        </main>
      </div>
      <footer class="flex h-4 justify-center text-[14px] dark:text-white">
        <div>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            class="duration-300 ease-in-out hover:text-HoverLightEm hover:dark:text-HoverDarkEm"
            style="user-select: none"
            >备案号: 粤ICP备2023050288号-1</a
          >
          <span class="ml-2 cursor-default" style="user-select: none"
            >©&nbsp;2023-2024 By Bread_etc</span
          >
        </div>
      </footer>
    </div>
  </div>
</template>
