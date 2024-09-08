<template>
  <div class="flex flex-col rounded-xl bg-transparent px-2 pb-2">
    <div class="h-[92vh] flex-1 overflow-auto rounded-xl" ref="scrollContainer">
      <!-- 卡片内容 -->
      <Card
        v-for="item in data"
        :key="item.id"
        class="card mb-3 h-[29vh] bg-LightContent dark:bg-DarkContent dark:text-white"
        v-animateonscroll="{
          enterClass: 'animate-fadeinright',
          leaveClass: 'animate-fadeoutright',
        }"
        style="transition: all ease-in-out 0.5s !important"
        @click="navigateToArticle(item)"
      >
        <template #title>
          <p class="text-xl font-extrabold">{{ item.title }}</p>
        </template>
        <template #content>
          <p class="cardCut m-0 text-sm">
            {{ item.content }}
          </p>
        </template>
        <template #footer>
          <div class="flex flex-col">
            <div class="flex space-x-2">
              <Tag
                v-for="category in item.categories"
                :key="category.id"
                :icon="`pi pi-${category.icon}`"
                :value="category.name"
                :style="{ backgroundColor: '#' + category.color }"
                class="custom-tag"
              ></Tag>
            </div>
          </div>
        </template>
      </Card>
      <!-- 骨架屏 -->
      <div class="h-[92vh] flex-1 overflow-auto rounded-xl" v-if="loading">
        <div
          v-for="n in 3"
          :key="n"
          class="mb-3 h-[29vh] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
        >
          <div class="p-4">
            <div
              class="mb-4 h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600"
            ></div>
            <div
              class="mb-4 h-4 w-1/6 rounded bg-gray-300 dark:bg-gray-600"
            ></div>
            <div class="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { Article, ArticleListParams, Meta } from "model/BlogInfo";
import { set } from "@vueuse/core";

const toastService = useToast();

const loading = ref(true);
const data = ref<Article[]>();
const meta = ref<Meta>();
let query = ref<ArticleListParams>({
  page: 1,
  limit: 10,
});

const navigateToArticle = (article: Article) => {
  navigateTo(`/article/${article.title}`);
};

/* 网络请求 */
const { blogInfo } = useApi();

const getArticleList = async () => {
  set(loading, true);
  const res = (await blogInfo.getList(query.value)).data;
  const fetchData = res.list;
  const fetchMeta = res.meta;
  set(data, fetchData);
  set(meta, fetchMeta);
  set(loading, false);
};

const loadMore = async () => {
  if (loading.value) return;
  if (data.value!.length >= meta.value!.total) return;
  set(loading, true);

  // 换页请求
  query.value.page++;
  const res = (await blogInfo.getList(query.value)).data;
  data.value?.push(...res.list);
  set(loading, false);
};

const scrollContainer = ref<HTMLElement | null>(null);

useInfiniteScroll(scrollContainer, loadMore, {
  distance: 250,
});

onMounted(() => {
  try {
    getArticleList();
  } catch (error) {
    toastService.add({
      severity: "error",
      summary: "Network Error",
      detail: error,
      life: 1500,
    });
  }
});
</script>

<style scoped>
.cardCut {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  line-clamp: 3;
}

.custom-tag {
  @apply text-black dark:text-white;
  box-shadow: -2px 4px 16px 3px rgba(0, 0, 0, 0.2);
  font-size: 0.6rem;
  padding: 0.25rem 0.5rem; /* 调整内边距，使 Tag 变小 */
}

.custom-tag:hover {
  @apply translate-y-[-4px] duration-300 ease-out; /* 向上浮动 4px */
}

.card {
  position: relative;
  overflow: hidden;
}

.card:after {
  content: "";
  transition: width 0.7s ease-out;
  @apply absolute bottom-0 left-0 h-1 w-0 rounded-md bg-LightEm dark:bg-DarkEm;
}

.card:hover:after {
  width: 100%;
}
</style>
