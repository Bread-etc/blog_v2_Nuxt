<template>
  <div class="flex rounded-xl bg-transparent p-4">
    <div
      class="flex h-[92vh] flex-1 flex-col overflow-auto rounded-xl dark:text-white"
    >
      <div class="flex justify-between">
        <h1 class="flex-1 text-2xl font-bold">关于📚</h1>
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
      <span class="py-1">信息工程专业在读大学生，主要学习前端</span>
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
      <h2 class="py-2 text-lg font-bold">友情链接🔗</h2>
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
definePageMeta({
  layout: "default",
});

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
  @apply pb-2;

  legend {
    @apply bg-transparent;
  }
}

:deep(.p-fieldset-toggleable > .p-fieldset-legend):hover {
  @apply bg-transparent text-black dark:text-white;
}
</style>
