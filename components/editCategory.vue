<template>
  <Dialog
    v-model:visible="isShow"
    modal
    class="w-1/2 !border-none dark:bg-DarkBg dark:text-white"
  >
    <template #header>
      <h1 class="text-lg font-semibold">编辑标签</h1>
    </template>
    <div class="flex flex-col">
      <div class="mb-2 flex flex-col">
        <label for="title" class="mb-1 text-sm font-semibold"
          >分类 (category)🥤:</label
        >
        <MultiSelect
          v-model="selectedTags"
          display="chip"
          :options="tags"
          optionLabel="name"
          filter
          :maxSelectedLabels="3"
          :invalid="selectedTags.length === 0"
        />
      </div>
      <div class="mb-2 flex justify-center">
        <label for="name" class="mb-1 text-sm font-semibold"
          >标签名称 (name)🍕:</label
        >
        <InputText
          class="flex-1 p-1 text-sm"
          v-model="name"
          type="text"
          size="small"
        />
      </div>
      <div class="mb-2 flex flex-col">
        <label for="color" class="mb-1 text-sm font-semibold"
          >颜色 (color)🍤:</label
        >
        <ColorPicker
          v-model="color"
          inputId="cp-hex"
          format="hex"
          class="mb-4"
        />
      </div>
      <div class="mb-2 flex justify-center">
        <label for="icon" class="mb-1 text-sm font-semibold"
          >图标 (icon)🍤:</label
        >
        <InputText
          class="flex-1 p-1 text-sm"
          v-model="icon"
          type="text"
          size="small"
        />
      </div>
    </div>
    <div class="mt-4 flex justify-end gap-4">
      <Button
        type="button"
        label="取消"
        severity="secondary"
        @click="cancelEditModal"
        size="small"
      ></Button>
      <Button
        type="button"
        label="保存"
        @click="saveEditModal"
        size="small"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
/* 弹窗控制 */
const isShow = ref(false);
const toastService = usePVToastService();

// 定义打开方法
const open = () => {
  isShow.value = true;
};
// 暴露给父组件
defineExpose({ open });

// Dialog 变量
const selectedTags: any = ref([]);
const tags = ref([
  { name: "vue.js", id: 0 },
  { name: "react.js", id: 1 },
  { name: "angular.js", id: 2 },
]);
const name = ref("");
const color = ref("");
const icon = ref("");

/* 辅助方法 */
const cancelEditModal = () => {
  isShow.value = false;
  toastService.add({
    severity: "warn",
    summary: "取消",
    detail: "取消编辑",
    life: 1500,
  });
};

const saveEditModal = async () => {
  isShow.value = false;
  try {
    toastService.add({
      severity: "success",
      summary: "成功",
      detail: "保存成功",
      life: 1500,
    });
  } catch (error) {
    toastService.add({
      severity: "error",
      summary: "失败",
      detail: "保存失败",
      life: 1500,
    });
  }
};
</script>

<style scoped></style>
