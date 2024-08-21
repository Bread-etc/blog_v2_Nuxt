<template>
  <div class="flex rounded-xl bg-transparent">
    <div
      class="flex h-[92vh] flex-1 flex-col overflow-hidden rounded-xl dark:text-white"
    >
      <div class="rounded-xl bg-transparent">
        <Toolbar class="toolbar flex h-12 flex-1">
          <template #start>
            <h1 class="ml-2 text-xl dark:text-white" style="font-weight: 1000">
              DashBoard💾
            </h1>
          </template>
          <template #end>
            <Button
              class="mr-2 text-black dark:text-white"
              icon="pi pi-compass"
              severity="secondary"
              text
              size="small"
              @click="isShowInfo = true"
            />
            <Button
              class="mr-2 text-black dark:text-white"
              icon="pi pi-plus"
              severity="secondary"
              text
              size="small"
              @click="isShow = true"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search"></i>
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Filter Search..."
              />
            </IconField>
          </template>
        </Toolbar>

        <div class="mt-4 text-sm">
          <div class="flex-1 overflow-hidden rounded-lg">
            <DataTable
              :value="articleList"
              :filters="filters"
              data-key="id"
              :loading="loading"
              :global-filter-fields="[
                'title',
                'fileName',
                'createdTime',
                'status',
              ]"
              :rows="10"
              row-hover
              paginator
              :rowsPerPageOptions="[10, 20]"
              @row-edit-save="editRowModal"
              scrollable
              scroll-height="calc(92vh -  6.5rem)"
            >
              <template #empty> 没有匹配项 </template>
              <template #loading> 加载中,请稍后... </template>
              <Column field="id" header="#"></Column>
              <Column field="title" header="标题"></Column>
              <Column field="fileName" header="文件名"></Column>
              <Column field="status" header="状态">
                <template #body="{ data }">
                  <Tag
                    style="transform: scale(0.8); transform-origin: -10%"
                    :severity="data.status === false ? 'danger' : 'success'"
                    :value="data.status === false ? '未完成' : '已完成'"
                  ></Tag>
                </template>
              </Column>
              <Column field="createdTime" header="创建时间"></Column>
              <Column field="updatedTime" header="更新时间"></Column>
              <Column filed="actions" header="操作">
                <template #body="{ data }">
                  <Button
                    class="scale-[0.6]"
                    icon="pi pi-pencil"
                    severity="secondary"
                    rounded
                    @click="editRowModal(data)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="isShow" modal class="w-1/2">
      <template #header>
        <h1 class="text-lg font-semibold">编辑信息</h1>
      </template>
      <div class="flex flex-col">
        <div id="title" class="mb-2 flex flex-col">
          <label for="title" class="mb-1 text-sm font-semibold"
            >标题 (title)🍔:</label
          >
          <InputText
            class="flex-1 p-1 text-sm"
            v-model="infoTitle"
            type="text"
            size="small"
          />
        </div>
        <div id="content" class="mb-2 flex flex-col">
          <label for="title" class="mb-1 text-sm font-semibold"
            >简介 (content)🍟:</label
          >
          <Textarea v-model="infoContent" rows="3" cols="30" />
        </div>
        <div id="category" class="mb-2 flex flex-col">
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
      </div>
      <div class="mt-4 flex justify-end gap-4">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="isShow = false"
          size="small"
        ></Button>
        <Button
          type="button"
          label="Save"
          @click="isShow = false"
          size="small"
        ></Button>
      </div>
    </Dialog>

    <Dialog v-model:visible="isShowInfo" modal class="w-1/2">
      <template #header>
        <h1 class="text-lg font-semibold">站点信息</h1>
      </template>
      <div class="flex flex-col">
        <div class="flex flex-col"></div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";

const toast = useToast();

// datatable 配置项
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const loading = ref(true);

// 定义表格所需变量
const articleList: any[] = [
  {
    id: 1,
    title: "vue.js",
    authorId: 1,
    status: true,
    categories: [{ name: "vue.js", id: 0 }],
    fileName: "vue.js",
    createdTime: "2024/08/20",
    updatedTime: "2024/08/20",
  },
  {
    id: 2,
    title: "react.js",
    authorId: 1,
    status: false,
    categories: [{ name: "react.js", id: 1 }],
    fileName: "react.js",
    createdTime: "2024/08/21",
    updatedTime: "2024/08/21",
  },
  {
    id: 3,
    title: "angular.js",
    authorId: 1,
    status: false,
    fileName: "angular.js",
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/08/22",
    updatedTime: "2024/08/22",
  },
  {
    id: 4,
    title: "vue.js",
    authorId: 1,
    status: false,
    fileName: "vue.js",
    categories: [{ name: "vue.js", id: 0 }],
    createdTime: "2024/08/20",
    updatedTime: "2024/08/20",
  },
  {
    id: 5,
    title: "react.js",
    authorId: 1,
    status: false,
    fileName: "react.js",
    categories: [{ name: "react.js", id: 1 }],
    createdTime: "2024/08/21",
    updatedTime: "2024/08/21",
  },
  {
    id: 6,
    title: "angular.js",
    fileName: "angular.js",
    authorId: 1,
    status: false,
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/08/22",
    updatedTime: "2024/08/22",
  },
  {
    id: 7,
    title: "angular.js",
    fileName: "angular.js",
    authorId: 1,
    status: false,
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/08/22",
    updatedTime: "2024/08/22",
  },
  {
    id: 8,
    title: "angular.js",
    fileName: "angular.js",
    authorId: 1,
    status: false,
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/08/22",
    updatedTime: "2024/08/22",
  },
  {
    id: 9,
    title: "angular.js",
    fileName: "angular.js",
    authorId: 1,
    status: false,
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/08/22",
    updatedTime: "2024/08/22",
  },
  {
    id: 10,
    title: "angular.js",
    fileName: "angular.js",
    authorId: 1,
    status: true,
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/09/21",
    updatedTime: "2024/09/21",
  },
  {
    id: 11,
    title: "angular.js",
    fileName: "angular.js",
    authorId: 1,
    status: true,
    categories: [{ name: "angular.js", id: 2 }],
    createdTime: "2024/09/21",
    updatedTime: "2024/09/21",
  },
];
const isShow = ref(false);
const isShowInfo = ref(false);

// Dialog 变量
const infoTitle = ref("");
const infoContent = ref("");
const selectedTags: any = ref([]);
const tags = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);

onMounted(() => {
  loading.value = false;
});

/* 辅助方法 */
const editRowModal = (data: any) => {
  isShow.value = true;
  console.log(data);
};
</script>

<style scoped>
.toolbar {
  @apply border-0 bg-transparent p-1;
}

:deep(.p-paginator) {
  scale: 0.8;
  padding: 0;
  background-color: transparent;
}

:deep(.p-datatable-paginator-bottom) {
  border: 0;
}

:deep(.p-datatable-tbody) {
  tr:last-child td:first-child {
    border-bottom-left-radius: 8px;
  }

  tr:last-child td:last-child {
    border-bottom-right-radius: 8px;
  }
}

:deep(.p-datatable-tbody > tr) {
  @apply bg-LightContent dark:bg-DarkContent dark:text-white;
}

:deep(.p-datatable-header-cell) {
  padding: 0.5rem 0.5rem;
  @apply bg-LightContent dark:bg-DarkContent dark:text-white;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 0 0.5rem;
}

:deep(tr) {
  border: none;
}

:deep(.p-datatable-tbody > tr > td) {
  border: #ccc;
}
</style>
