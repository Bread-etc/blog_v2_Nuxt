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
            <!-- 打开站点信息弹窗 -->
            <Button
              class="mr-2 text-black dark:text-white"
              icon="pi pi-compass"
              severity="secondary"
              text
              size="small"
              @click="showInfoDialog"
            />
            <!-- 打开分类编辑弹窗 -->
            <Button
              class="mr-2 text-black dark:text-white"
              icon="pi pi-tags"
              severity="secondary"
              text
              size="small"
              @click="showTagDialog"
            />
            <!-- 打开文章新建弹窗 -->
            <Button
              class="mr-2 text-black dark:text-white"
              icon="pi pi-plus"
              severity="secondary"
              text
              size="small"
              @click="showEditDialog(false)"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search"></i>
              </InputIcon>
              <InputText
                size="small"
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
              @row-edit-save="showEditDialog"
              scrollable
              scroll-height="calc(92vh -  6.5rem)"
            >
              <template #empty>
                <div class="my-1">没有匹配项</div>
              </template>
              <template #loading>
                <div class="my-1">加载中,请稍后...</div>
              </template>
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
                  <!-- 打开文章编辑弹窗 -->
                  <Button
                    class="scale-[0.6]"
                    icon="pi pi-pencil"
                    severity="secondary"
                    rounded
                    @click="showEditDialog(data)"
                  />
                  <!-- 删除文章popover -->
                  <Button
                    class="scale-[0.6]"
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    @click="deleteItem(data, $event)"
                  ></Button>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog></ConfirmDialog>
    <EditDialog ref="refEditDialog" />
    <EditCategory ref="refEditTagDialog" />
    <InfoDialog ref="refInfoDialog" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import type { Article, articleShow } from "model/BlogInfo";

const confirm = useConfirm();
const toastService = usePVToastService();

// datatable 配置项
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const loading = ref(true);

// 数据和请求参数
let articleList: articleShow[] = [];
let query = ref({
  page: 1,
  limit: 10,
});

/* 弹窗 Dialog 控制 */
const refInfoDialog = ref();
const showInfoDialog = () => {
  refInfoDialog.value.open();
};

const refEditTagDialog = ref();
const showTagDialog = () => {
  refEditTagDialog.value.open();
};

const refEditDialog = ref();
const showEditDialog = async (data: any) => {
  await refEditDialog.value.open();
  if (!data) {
    await refEditDialog.value.setData(false);
  } else {
    let dialogValue: Article = await getArticleById(data.id);
    await refEditDialog.value.setData(dialogValue);
  }
};

/* 网络请求 */
const { blogInfo } = useApi();
const getArticleList = async () => {
  loading.value = true;
  let list = (await blogInfo.getList(query.value)).data.list;
  articleList = list.map((item) => {
    const fileName = item.postFiles[0].fileName;
    return {
      id: item.id,
      title: item.title,
      authorId: item.authorId,
      status: item.status,
      fileName: fileName.slice(0, fileName.indexOf(".")),
      categories: item.categories,
      createdTime: useDateFormat(item.createdTime, "YYYY-MM-DD").value,
      updatedTime: useDateFormat(item.updatedTime, "YYYY-MM-DD").value,
    };
  });
  loading.value = false;
};

const getArticleById = async (id: number) => {
  let params: { id: number } = { id: id };
  let data = (await blogInfo.getArticle(params)).data;
  return data;
};

const deleteItem = async (data: articleShow, event: any) => {
  confirm.require({
    message: `是否删除${data.fileName}.md和相关记录?`,
    header: "删除记录",
    icon: "pi pi-times-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "取消",
      severity: "secondary",
    },
    acceptProps: {
      label: "删除",
      severity: "danger",
    },
    accept: async () => {
      const params = { postId: data.id };
      const res = await blogInfo.deleteArticle(params);
      toastService.add({
        summary: "删除文章成功",
        detail: res.data,
        severity: "success",
        life: 1500,
      });
      await getArticleList();
    },
    reject: () => {
      toastService.add({
        severity: "warn",
        summary: "取消删除",
        detail: "您取消了删除该文章",
        life: 1500,
      });
    },
  });
};

onMounted(() => {
  getArticleList();
});
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
  @apply border-none;
}

:deep(.p-datatable-tbody > tr > td) {
  @apply border-[#bbb];
}
</style>
