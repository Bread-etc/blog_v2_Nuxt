<template>
  <Dialog
    v-model:visible="isShow"
    modal
    class="w-2/5 !border-none dark:bg-DarkBg dark:text-white"
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
        <label for="content" class="mb-1 text-sm font-semibold"
          >简介 (content)🍟:</label
        >
        <Textarea v-model="content" rows="3" cols="30" />
      </div>
      <div class="mb-2 flex flex-col">
        <label for="category" class="mb-1 text-sm font-semibold"
          >分类 (category)🥤:</label
        >
        <MultiSelect
          v-model="selectedTags"
          display="chip"
          option-label="name"
          :options="tags"
          filter
          :maxSelectedLabels="3"
          :invalid="selectedTags.length === 0"
        />
      </div>
    </div>
    <div class="mb-2 flex flex-col">
      <label for="upload" class="mb-1 text-sm font-semibold">
        上传文件 (upload)🍿:
      </label>
      <FileUpload
        ref="fileUpload"
        mode="basic"
        :maxFileSize="1000000"
        chooseLabel="Choose markdown files"
      />
    </div>
    <div class="mb-2 flex flex-col">
      <label for="status" class="mb-1 text-sm font-semibold">
        是否完成 (status)🍙:
      </label>
      <ToggleSwitch v-model="status" />
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
import type { Category } from "model/Category";
import type { Article } from "model/BlogInfo";
import { get, set } from "@vueuse/core";

/* 弹窗控制 */
const isShow = ref(false);
// 吐司组件
const toastService = useToast();
const dialogData = ref<Article>();
const mode = ref(false); // false 为创建模式，true 为编辑模式
// 定义打开方法
const open = () => {
  isShow.value = true;
  getCategories();
};
// 定义数据获取方法
const setData = (data: Article | boolean) => {
  if (typeof data === "boolean") {
    mode.value = false;
  } else {
    mode.value = true;
    dialogData.value = data;
    let value = toRaw(dialogData.value);
    if (value) {
      set(postId, value.id);
      set(authorId, value.authorId);
      set(title, value.title);
      set(content, value.content ? value.content : "");
      set(selectedTags, value.categories);
      set(status, value.status);
    }
  }
};
// 定义父组件方法
const emit = defineEmits(["refresh"]);

// 暴露给父组件
defineExpose({ open, setData });

// 绑定渲染变量
const postId = ref(1);
const authorId = ref(1);
const title = ref("");
const content = ref("");
const selectedTags = ref<Category[]>([]);
const tags = ref<Category[]>([]);
const fileUpload = ref();
const status = ref(false);

/* 辅助方法 */
const cancelEditModal = () => {
  isShow.value = false;
  toastService.add({
    severity: "warn",
    summary: "取消",
    detail: "取消编辑",
    life: 1500,
  });
  clearUpInfo();
};

const saveEditModal = async () => {
  isShow.value = false;
  get(mode) ? await updateArticle() : await submitCreate();
  clearUpInfo();
  emit("refresh");
};

const clearUpInfo = () => {
  postId.value = 1;
  title.value = "";
  content.value = "";
  selectedTags.value = [];
  tags.value = [];
  fileUpload.value = null;
  status.value = false;
};

/* 网络请求 */
const { blogInfo, category } = useApi();

// 提交创建表单
const submitCreate = async () => {
  let sendTags: string[] = [];
  selectedTags.value.forEach((item) => {
    sendTags.push(String(item.id));
  });

  const formData = new FormData();

  formData.append("title", title.value);
  formData.append("content", content.value);
  formData.append("authorId", String(authorId.value));
  formData.append("tags", sendTags.join());
  if (fileUpload.value && fileUpload.value.files.length > 0) {
    formData.append("file", fileUpload.value.files[0]);
  }
  formData.append("status", String(status.value));

  const res = await blogInfo.createArticle(formData);

  if (res.success) {
    toastService.add({
      severity: "success",
      summary: "成功",
      detail: "新增成功",
      life: 1500,
    });
  } else {
    toastService.add({
      severity: "error",
      summary: "失败",
      detail: "新增失败",
      life: 1500,
    });
  }
};

// 获取标签列表
const getCategories = async () => {
  tags.value = (await category.getList()).data;
};

// 更新指定 id 标签
const updateArticle = async () => {
  let sendTags = selectedTags.value.map((item) => String(item.id));

  const formData = new FormData();

  formData.append("postId", String(postId.value));
  formData.append("title", title.value);
  formData.append("content", content.value);
  formData.append("tags", sendTags.join());
  formData.append("status", String(status.value));

  // 如果有新的文件上传
  if (fileUpload.value && fileUpload.value.files.length > 0) {
    formData.append("file", fileUpload.value.files[0]);
  }

  const res = await blogInfo.updateArticle(formData);

  if (res.success) {
    toastService.add({
      severity: "success",
      summary: "成功",
      detail: "更新成功",
      life: 1500,
    });
  } else {
    toastService.add({
      severity: "error",
      summary: "失败",
      detail: "更新失败",
      life: 1500,
    });
  }
};
</script>

<style scoped>
:deep(.p-fileupload-basic) {
  @apply scale-75 justify-start;
  transform-origin: 0;
}
</style>
