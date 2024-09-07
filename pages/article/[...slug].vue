<template>
  <div class="flex rounded-xl bg-transparent pt-4">
    <div class="flex h-[92vh] flex-1 flex-col overflow-auto">
      <main>
        <div v-if="doc" class="flex">
          <div class="flex flex-1 justify-center">
            <ContentRenderer
              :value="doc"
              class="prose prose-green flex flex-col dark:prose-yellow dark:prose-invert"
            />
          </div>
          <div class="sticky top-20 ml-2 self-start overflow-hidden">
            <h2
              class="mb-2 text-sm font-bold dark:text-white"
              style="transform-origin: top left"
            >
              目录🗿
            </h2>
            <Tree
              v-if="treeNodes?.length"
              :value="treeNodes"
              scrollHeight="calc(50vh + 1rem)"
              selectionMode="single"
              @nodeSelect="onNodeSelect"
              class="scale-[0.8] rounded border border-gray-500 dark:border-white"
              style="
                min-height: calc(50vh + 2rem + 2px);
                transform-origin: top left;
              "
            />
            <div
              v-else
              class="flex scale-[0.8] flex-col items-center justify-center rounded border border-gray-500 dark:border-white dark:text-white"
              style="
                min-height: calc(50vh + 2rem + 2px);
                transform-origin: top left;
              "
            >
              <p>暂无目录📍</p>
            </div>
            <div
              class="scale-[0.8] text-center text-sm dark:text-white"
              style="transform-origin: top left"
            >
              <p>发布时间: {{ articleInfo.createdTime }}</p>
              <Divider class="h-[1px] bg-black" />
              <p>更新时间: {{ articleInfo.updatedTime }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ParsedContent } from "@nuxt/content";
import type { TreeNode } from "primevue/treenode";

const route = useRoute();
const toastService = useToast();
const articleInfo = ref();
const { blogInfo } = useApi();

const getFileName = async () => {
  const slug = route.params.slug[0];
  const param = { query: slug };
  const res = (await blogInfo.searchArticle(param)).data;
  articleInfo.value = {
    createdTime: useDateFormat(res[0].createdTime, "YYYY-MM-DD"),
    updatedTime: useDateFormat(res[0].updatedTime, "YYYY-MM-DD"),
    category: res[0].categories,
  };
  return res[0].postFiles[0].fileName;
};

const fileName = await getFileName();
const treeNodes = ref<TreeNode[]>();

// 查询文档内容
const { data: doc } = await useAsyncData("doc", () =>
  queryContent().where({ _file: fileName }).findOne(),
);

// 动态设置页面标题
useHead({
  title: `Bread_etc / ${doc?.value?.title || "文章"}`,
});

// 构建树形图
const structureTreeNode = (doc: ParsedContent) => {
  let treeNode: TreeNode[] = [];
  if (doc.body?.toc) {
    // 第一层嵌入
    let i = 0;
    doc.body.toc.links.forEach((item) => {
      let node = {
        id: item.id,
        key: String(i),
        label: item.text,
        children: [],
      };
      i++;
      treeNode.push(node);
    });

    // 第二层嵌入
    for (let j = 0; j < treeNode.length; j++) {
      if (doc.body.toc.links[j].children) {
        let k = 0;
        doc.body.toc.links[j].children?.forEach((item) => {
          let node: TreeNode = {
            id: item.id,
            key: String(j) + "-" + String(k),
            label: item.text,
            type: "url",
          };
          k++;
          treeNode[j].children!.push(node);
        });
      }
    }
  }
  return treeNode;
};

// 当doc存在时，生成并赋值treeNodes
if (doc.value) {
  treeNodes.value = structureTreeNode(doc.value);
}

// 选择node节点并导航到指定节点
const onNodeSelect = (node: TreeNode) => {
  // 锚点为 node.id
  const anchorElement = document.getElementById(node.id);

  if (anchorElement) {
    anchorElement.scrollIntoView({ behavior: "smooth" });
  } else {
    toastService.add({
      severity: "error",
      summary: "Error",
      detail: "Node not found",
      life: 1500,
    });
  }
};
</script>

<style scoped>
:root {
  user-select: none;
  code {
    user-select: text;
  }
}

:deep(.p-tree) {
  @apply bg-transparent p-0 text-sm duration-300;
}

:deep(.p-tree-node-label) {
  @apply cursor-pointer text-gray-500;
}

:deep(.p-tree-node-toggle-button) {
  @apply scale-75 text-gray-500;
}

:deep(.p-tree-node-children) {
  .p-tree-node > .p-tree-node-content > button {
    opacity: 0; /* 隐藏按钮但保持其功能 */
    pointer-events: none; /* 禁用按钮的点击事件 */
    width: 0px;
  }

  .p-tree-node > .p-tree-node-content > .p-tree-node-label {
    margin-left: 0.5rem;
  }
}

:deep(.p-tree-node-content.p-tree-node-selectable):not(
    .p-tree-node-selected
  ):hover {
  @apply bg-slate-300 transition-all duration-700 ease-in-out dark:bg-[#f1f5f9];
}
</style>
