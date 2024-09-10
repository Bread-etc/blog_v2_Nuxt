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
                v-model="searchValue"
                @keyup.enter.native="searchPost"
                placeholder="Post Search..."
              />
            </IconField>
          </template>
        </Toolbar>

        <div class="mt-4 text-sm">
          <div class="flex-1 overflow-hidden rounded-lg">
            <DataTable
              :value="articleList"
              data-key="id"
              :loading="loading"
              :lazy="true"
              :rows="10"
              row-hover
              paginator
              :rowsPerPageOptions="[10, 20]"
              paginator-template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="{first} to {last} of {currentPage}"
              :totalRecords="meta.total"
              @row-edit-save="showEditDialog"
              @page="changeQuery($event)"
              scrollable
              scroll-height="calc(92vh -  6.5rem)"
            >
              <template #empty>
                <div class="my-1">没有匹配项</div>
              </template>
              <template #loading>
                <div class="my-1">加载中,请稍后...</div>
              </template>
              <Column field="showId" header="#"></Column>
              <Column field="title" header="标题" class="w-1/5"></Column>
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

    <ConfirmDialog />
    <EditDialog ref="refEditDialog" @refresh="getArticleList" />
    <EditCategory ref="refEditTagDialog" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: `Dashboard`,
});
import { ref, onMounted } from "vue";
import type { Article, articleShow } from "~/api/model/BlogInfo";
import { set } from "@vueuse/core";

const confirm = useConfirm();
// 吐司组件
const toastService = useToast();
// datatable 配置项
const searchValue = ref("");
const loading = ref(true);

// 数据和请求参数
let articleList: articleShow[] = [];
let query = ref({
  page: 1,
  limit: 10,
});
const meta = ref<{
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}>({
  currentPage: 0,
  pageSize: 0,
  total: 0,
  totalPages: 0,
});

/* 弹窗 Dialog 控制 */
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
  set(loading, true);
  let data = (await blogInfo.getList(query.value)).data;
  let list = data.list;
  set(meta, data.meta);
  let ascId: number = 0;
  articleList = list.map((item) => {
    const fileName = item.postFiles[0].fileName;
    ascId++;
    return {
      showId: ascId,
      id: item.id,
      title: item.title,
      authorId: item.authorId,
      status: item.status,
      fileName: fileName.slice(0, -3),
      categories: item.categories,
      createdTime: useDateFormat(item.createdTime, "YYYY-MM-DD").value,
      updatedTime: useDateFormat(item.updatedTime, "YYYY-MM-DD").value,
    };
  });
  set(loading, false);
};

const getArticleById = async (id: number) => {
  const params: { id: number } = { id: id };
  let data = (await blogInfo.searchArticleById(params)).data;
  return data;
};

const deleteItem = async (data: articleShow, event: any) => {
  confirm.require({
    message: `是否删除${data.fileName}.md和相关记录?`,
    header: "删除记录",
    icon: "pi pi-times-circle",
    rejectLabel: "取消",
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

const changeQuery = (event: any) => {
  // 分页控制
  if (event) {
    query.value.page = event.page + 1;
    query.value.limit = event.rows;
    getArticleList();
  } else {
    console.warn("query is null");
  }
};

const searchPost = async () => {
  if (!searchValue.value) {
    getArticleList();
  } else {
    const params: { query: string } = { query: searchValue.value };
    set(loading, true);
    try {
      let data = (await blogInfo.searchArticle(params)).data;

      if (data && data.length > 0) {
        let ascId: number = 0;
        articleList = data.map((item) => {
          const fileName = item.postFiles[0].fileName;
          ascId++;
          return {
            showId: ascId,
            id: item.id,
            title: item.title,
            authorId: item.authorId,
            status: item.status,
            fileName: fileName.slice(0, -3),
            categories: item.categories,
            createdTime: useDateFormat(item.createdTime, "YYYY-MM-DD").value,
            updatedTime: useDateFormat(item.updatedTime, "YYYY-MM-DD").value,
          };
        });
      } else {
        toastService.add({
          severity: "warn",
          summary: "未找到匹配项",
          detail: "未找到匹配项",
          life: 1500,
        });
      }
    } catch (error: any) {
      toastService.add({
        severity: "warn",
        summary: "未找到匹配项",
        detail: "未找到匹配项",
        life: 1500,
      });
    } finally {
      set(loading, false);
      set(searchValue, "");
    }
  }
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
