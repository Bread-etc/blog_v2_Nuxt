<template>
  <div class="flex rounded-xl bg-transparent p-4">
    <div class="flex h-[92vh] flex-1 flex-col">
      <main class="overflow-hidden">
        <div v-if="doc" class="flex justify-center">
          <ContentRenderer :value="doc" class="prose dark:text-white" />
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const { blogInfo } = useApi();

const getFileName = async () => {
  const slug = route.params.slug[0];
  const param = { query: slug };
  const res = (await blogInfo.searchArticle(param)).data;
  return res[0].postFiles[0].fileName;
};

const fileName = await getFileName();

// 查询文档内容
const { data: doc } = await useAsyncData("doc", () =>
  queryContent().where({ _file: fileName }).findOne(),
);
</script>

<style scoped></style>
