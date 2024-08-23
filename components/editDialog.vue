<template>
  <Dialog
    v-model:visible="isShow"
    modal
    class="w-1/2 !border-none dark:bg-DarkBg dark:text-white"
  >
    <template #header>
      <h1 class="text-lg font-semibold">编辑信息</h1>
    </template>
    <div class="flex flex-col">
      <div class="mb-2 flex flex-col">
        <label for="title" class="mb-1 text-sm font-semibold"
          >标题 (title)🍔:</label
        >
        <InputText
          class="flex-1 p-1 text-sm"
          v-model="title"
          type="text"
          size="small"
        />
      </div>
      <div class="mb-2 flex flex-col">
        <label for="title" class="mb-1 text-sm font-semibold"
          >简介 (content)🍟:</label
        >
        <Textarea v-model="content" rows="3" cols="30" />
      </div>
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
      <div class="mb-2 flex flex-col">
        <label for="title" class="mb-1 text-sm font-semibold">
          上传文件 (upload)🍿:
        </label>
        <FileUpload
          ref="fileUpload"
          mode="basic"
          url="/api/upload"
          :maxFileSize="1000000"
          chooseLabel="Choose markdown files"
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
const open = (data: any) => {
  isShow.value = true;
  data.value = data;
};
// 暴露给父组件
defineExpose({ open });

// Dialog 变量
const data = ref();
// 绑定渲染变量
const title = ref("");
const content = ref("");
const selectedTags: any = ref([]);
const tags = ref([
  { name: "vue.js", id: 0 },
  { name: "react.js", id: 1 },
  { name: "angular.js", id: 2 },
]);
const fileUpload = ref();

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
    const uploadResponse = await fileUpload.value.upload();
    console.log(uploadResponse);
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

onMounted(() => {
  console.log(data, "data");
});
</script>

<style scoped>
:deep(.p-fileupload-basic) {
  @apply scale-75 justify-start;
  transform-origin: 0;
}
</style>
