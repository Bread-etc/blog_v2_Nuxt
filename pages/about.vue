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
      <h2 class="py-2 text-lg font-bold">HeatMap🎯</h2>
      <img
        style="scale: 0.8; transform-origin: top left"
        src="http://ghchart.rshah.org/Bread-etc"
        alt="Bread-etc's Github chart"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
