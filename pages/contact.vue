<template>
  <div class="p-4 dark:text-white">
    contact
    <button @click="showToast()">123456</button>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
const toast = useToast();

const showToast = () => {
  toast.add({
    severity: "success",
    summary: "Success Message",
    detail: "Message Content",
    life: 3000
  });
};
</script>

<style scoped></style>
