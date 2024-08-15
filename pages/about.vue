<template>
  <div class="flex rounded-xl bg-transparent p-4">
    <div
      class="flex h-[92vh] flex-1 flex-col overflow-auto rounded-xl dark:text-white"
    >
      <div class="flex justify-between">
        <h1 class="flex-1 text-2xl">关于📚</h1>
        <Button
          label="Edit"
          icon="pi pi-user-edit"
          severity="secondary"
          outlined
          size="small"
          class="scale-[0.65] rounded-lg dark:border-white dark:text-white"
          @click="routeToLogin()"
        />
      </div>
      <span class="py-1">信息工程专业大学生，主要方向为前端</span>
      <Fieldset
        id="fieldset"
        class="bg-LightContent dark:bg-DarkContent dark:text-white"
        :toggleable="true"
      >
        <template #legend> 联系方式📧 </template>
        <p class="m-0 flex flex-col">
          <span class="email px-1 text-sm font-bold">
            QQMail: 1054115624@qq.com
          </span>
          <span class="email px-1 text-sm font-bold">
            Gmail: mianbao.etc@gmail.com
          </span>
        </p>
      </Fieldset>
      <h2 class="py-2 text-lg">友情链接🔗</h2>
      <Fieldset
        id="fieldset"
        class="bg-LightContent dark:bg-DarkContent dark:text-white"
        :toggleable="true"
      >
        <template #legend> Link📌 </template>
        <p class="m-0 flex flex-col">
          <NuxtLink
            v-for="link in friendLinkList"
            class="email inline-block px-1 text-sm font-bold text-blue-500"
            alt="friendLink"
            :to="link.value"
            no-rel
            target="_blank"
          >
            {{ link.name }}
          </NuxtLink>
        </p>
      </Fieldset>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import type { BlogInfo } from "../api/model/BlogInfo";
import { useApi } from "../composables/index";
import { navigateTo } from "nuxt/app";

// const { blogInfo } = useApi();

// async function getList() {
//   const data: BlogInfo = await blogInfo.getList();
//   console.log(data);
// }

// onMounted(async () => {
//   try {
//     const data = await blogInfo.getList();
//     console.log("数据:", data);
//   } catch (error) {
//     console.error("请求失败:", error);
//   }
// });

const friendLinkList: { id: number; value: string; name: string }[] = [
  { id: 1, value: "http://hastur23.top", name: "hastur23.top" },
  { id: 2, value: "https://github.com", name: "github" },
  { id: 3, value: "https://x.com", name: "x.com" },
];

// 跳转后台登录界面
const routeToLogin = () => {
  navigateTo("/admin/login");
};
</script>

<style scoped>
.email {
  font-family: "Courier New", Courier, monospace;
}

:deep(#fieldset) {
  padding-bottom: 0.5rem;

  legend {
    background: none;
  }
}

:deep(.p-fieldset-toggleable > .p-fieldset-legend):hover {
  @apply text-black dark:text-white; /* 轻模式下为黑色，暗模式下为白色 */
  background: transparent;
}
</style>
