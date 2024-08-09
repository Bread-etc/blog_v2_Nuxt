//./error.vue
<template>
  <div
    class="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-lightOutBgImage dark:bg-darkOutBgImage lg:px-4"
  >
    <Toast />
    <div
      class="flex h-[100vh] w-[70%] max-w-screen-xl items-center justify-center bg-LightBg transition-all duration-300 ease-in-out dark:bg-DarkBg lg:h-[98vh] lg:rounded-xl"
    >
      <aside>
        <Side />
      </aside>
      <main class="m-4 flex-1">
        <div class="h-[92vh]">
          <div class="flex rounded-xl bg-transparent p-4">
            <div
              class="flex justify-center items-center h-[92vh] flex-1 flex-col overflow-auto rounded-xl dark:text-white"
            >
              <h1 class="text-3xl">Error 😥</h1>
              <span class="py-4 text-xl">{{ error.message }}</span>
              <Button
                label="Go back home"
                severity="warn"
                icon="pi pi-times-circle"
                @click="handleError"
                size="small"
              ></Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clearError } from "nuxt/app";

const props = defineProps({
  error: Object,
});
const handleError = () => clearError({ redirect: "/" });
</script>
