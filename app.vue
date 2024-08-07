<template>
  <div
    class="flex justify-center items-center min-h-screen w-screen lg:px-4 overflow-hidden bg-lightOutBgImage dark:bg-darkOutBgImage">
    <div style="transition: all ease-in-out 0.3s !important;"
      class="bg-LightBg dark:bg-DarkBg w-full max-w-screen-xl w-[70%] lg:rounded-xl lg:h-[98vh] h-[100vh] flex justify-center items-center">
      <aside>
        <Side></Side>
      </aside>
      <main class="flex-1 m-4">
        <NuxtPage keepalive class="h-[92vh]"></NuxtPage>
      </main>
    </div>
  </div>
</template>