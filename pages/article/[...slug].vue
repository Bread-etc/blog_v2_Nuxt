<template>
  <div class="flex rounded-xl bg-transparent pt-4">
    <div class="flex h-[92vh] flex-1 flex-col overflow-auto">
      <main>
        <div v-if="doc" class="flex w-full">
          <article class="flex flex-1 justify-center">
            <div
              v-html="doc"
              class="prose prose-green select-none dark:prose-yellow dark:prose-invert prose-h1:font-extrabold prose-a:no-underline prose-code:select-text prose-img:rounded-md"
            ></div>
          </article>
          <div
            class="sticky top-[4.5rem] ml-2 max-w-48 flex-1 self-start overflow-hidden"
          >
            <h2 class="mb-2 text-sm font-bold dark:text-white">目录🗿</h2>
            <Tree
              v-if="treeNodes?.length"
              :value="treeNodes"
              scrollHeight="calc(50vh + 1rem)"
              selectionMode="single"
              @nodeSelect="onNodeSelect"
              class="rounded border border-gray-500 text-sm dark:border-white"
              style="min-height: calc(50vh + 2rem + 2px)"
              :pt="{
                nodeToggleButton: {
                  class: ['scale-75', 'text-gray-500'],
                },
                nodeLabel: {
                  class: ['text-xs', 'cursor-pointer', 'text-gray-500'],
                },
              }"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center rounded border border-gray-500 dark:border-white dark:text-white"
              style="min-height: calc(50vh + 2rem + 2px)"
            >
              <p>暂无目录📍</p>
            </div>
            <div class="mt-4 text-center text-xs dark:text-white">
              <div>发布于{{ articleInfo.createdTime }}</div>
              <hr class="my-2 h-[2px] bg-black dark:bg-white" />
              <div>更新于{{ articleInfo.updatedTime }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Loading</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "content",
});
import "highlight.js/styles/atom-one-dark-reasonable.css";
import type { TreeNode } from "primevue/treenode";

const route = useRoute();
const { blogInfo } = useApi();
const toastService = useToast();
const articleInfo = ref();

// 获取文件名
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

// 获取md文档内容和toc
const getFileContentAndToc = async () => {
  const params = { filename: fileName };
  const res = (await blogInfo.getFile(params)).data;
  if (!res) {
    toastService.add({
      severity: "error",
      summary: "Error",
      detail: "File not found",
      life: 1500,
    });
    return { content: "", toc: [{ label: "Node", index: 1, id: "" }] };
  } else {
    return { content: res.content, toc: res.toc };
  }
};

const { content: doc, toc: toc } = await getFileContentAndToc();

// 构建树形图
const structureTreeNode = async () => {
  let treeNode: TreeNode[] = [];
  if (toc) {
    let newToc = useCloneDeep(toc);
    newToc.shift();
    // 已经分好的分组
    let groupToc: any[] = [];
    let currentGroup: { label: string; index: number; id: string }[] = [];
    newToc.forEach((item) => {
      if (item.index === 2) {
        if (currentGroup.length > 0) {
          groupToc.push(currentGroup);
        }
        currentGroup = [item];
      } else {
        currentGroup.push(item);
      }
    });

    // 手动将最后的 h2 及其 h3 推入 groupToc
    if (currentGroup.length > 0) {
      groupToc.push(currentGroup);
    }

    let i = 0;
    groupToc.forEach((group) => {
      // 第一层
      let firstNode: TreeNode = {
        id: group[0].id,
        key: String(i),
        label: group[0].label,
        children: [],
      };
      treeNode.push(firstNode);

      for (let j = 1; j < group.length; j++) {
        let childNode: TreeNode = {
          id: group[j].id,
          key: String(i) + "-" + String(j),
          label: group[j].label,
          type: "url",
        };
        treeNode[i].children!.push(childNode);
      }
      i++;
    });
  } else {
    treeNode = [];
  }
  return treeNode;
};

const treeNodes = await structureTreeNode();

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

// 给有img元素的a标签添加target属性
onMounted(() => {
  const elements = document.querySelectorAll("a");

  elements.forEach((item) => {
    if (item.querySelector("img")) {
      item.target = "_blank";
    }
  });
});
</script>

<style scoped>
:deep(.p-tree) {
  @apply bg-transparent p-0 text-sm duration-300;
}

:deep(.p-tree-node-children) {
  .p-tree-node > .p-tree-node-content > button {
    opacity: 0;
    /* 隐藏按钮但保持其功能 */
    pointer-events: none;
    /* 禁用按钮的点击事件 */
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
