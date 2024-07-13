<template>
  <div class="flex justify-center items-center min-h-screen w-screen lg:px-4 overflow-hidden">
    <div
      class="bg-gray-200 w-full max-w-screen-lg lg:rounded-xl lg:h-[98vh] h-[100vh] flex justify-center items-center">
      <aside>
        <Side></Side>
      </aside>
      <main class="flex-1 m-4">
        <NuxtPage keepalive class="h-[95vh]"></NuxtPage>
      </main>
    </div>
  </div>
</template>