<template>
  <Dialog
    v-model:visible="isShow"
    modal
    class="w-2/5 !border-none dark:bg-DarkBg dark:text-white"
  >
    <template #header>
      <div class="flex flex-1 items-center text-nowrap text-lg font-semibold">
        编辑标签
        <SelectButton
          v-model="mode"
          :options="options"
          class="flex-1 scale-[0.7] justify-center"
        />
      </div>
    </template>
    <div class="flex flex-col">
      <div class="mb-2 flex flex-col" v-show="mode !== '创建'">
        <label for="title" class="mb-1 text-sm font-semibold"
          >分类 (category) 🥤:</label
        >
        <Select
          v-model="selectedTags"
          display="chip"
          :options="tags"
          optionLabel="name"
          filter
          :maxSelectedLabels="3"
          @change="selectChange"
        />
      </div>
      <div class="mb-2 flex flex-col" v-show="mode !== '删除'">
        <label for="name" class="mb-1 text-sm font-semibold"
          >标签名称 (name) 🍕:</label
        >
        <InputText
          class="flex-1 p-1 text-sm"
          v-model="name"
          type="text"
          size="small"
        />
      </div>
      <div class="mb-2 flex flex-col" v-show="mode !== '删除'">
        <label for="color" class="mb-1 text-sm font-semibold"
          >颜色 (color) 🍤:</label
        >
        <div class="flex items-center">
          <ColorPicker
            v-model="color"
            inputId="cp-hex"
            format="hex"
            class="mr-4"
          />
          <InputText
            class="flex-1 p-1 text-sm"
            v-model="color"
            type="text"
            size="small"
          />
        </div>
      </div>
      <div class="mb-2 flex flex-col" v-show="mode !== '删除'">
        <label for="icon" class="mb-1 text-sm font-semibold"
          >图标 (icon) 🍖:</label
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
        :severity="mode === '删除' ? 'danger' : 'success'"
        :label="mode === '删除' ? '删除' : '保存'"
        @click="saveEditModal"
        size="small"
      ></Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import type { Category, CategoryWithoutId } from "model/Category";
import type { MultiSelectChangeEvent } from "primevue/multiselect";

/* 弹窗控制 */
const isShow = ref(false);
const mode = ref("创建");
const options = ref(["创建", "编辑", "删除"]);
// 吐司组件
const toastService = useToast();

// 定义打开方法
const open = () => {
  isShow.value = true;
};
// 暴露给父组件
defineExpose({ open });

// Dialog 变量
const selectedTags = ref<Category[]>([]);
const tags = ref<Category[]>([]);
const tagId = ref(1);
const name = ref("");
const color = ref<string | undefined>("");
const icon = ref<string | undefined>("");

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
  if (mode.value === "创建") {
    await createTag();
  } else if (mode.value === "编辑") {
    await updateTag();
  } else {
    await deleteTag();
  }
};

const selectChange = (event: MultiSelectChangeEvent) => {
  const value: Category = toRaw(event.value);
  tagId.value = value.id;
  name.value = value.name;
  color.value = value.color;
  icon.value = value.icon;
};

/* 网络请求 */
const { category } = useApi();

// 获取tag列表
async function getList() {
  tags.value = (await category.getList()).data;
}

// 创建新标签
async function createTag() {
  const params: CategoryWithoutId = {
    name: name.value,
    color: color.value,
    icon: icon.value,
  };
  const res = await category.createTag(params);
  toastService.add({
    summary: "创建标签成功",
    detail: res.data,
    severity: "success",
    life: 1500,
  });
  clearUpInfo();
}

// 更新对应标签
async function updateTag() {
  const params: Category = {
    id: tagId.value,
    name: name.value,
    color: color.value,
    icon: icon.value,
  };
  const res = await category.updateTag(params);
  toastService.add({
    summary: "更新标签成功",
    detail: res.data,
    severity: "success",
    life: 1500,
  });
  clearUpInfo();
}

// 删除对应标签
async function deleteTag() {
  const params = { id: tagId.value };
  const res = await category.deleteTag(params);
  toastService.add({
    summary: "删除标签成功",
    detail: res.data,
    severity: "success",
    life: 1500,
  });
  clearUpInfo();
}

// 清空输入框
const clearUpInfo = () => {
  selectedTags.value = [];
  tagId.value = 1;
  name.value = "";
  color.value = "";
  icon.value = "";
  getList();
};

/* 生命周期钩子 */
onMounted(async () => {
  try {
    getList();
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped></style>
