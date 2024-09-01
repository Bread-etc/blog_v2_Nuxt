<template>
  <div class="flex rounded-xl bg-transparent p-4">
    <div
      class="flex flex-1 flex-col items-center justify-center overflow-auto rounded-xl dark:text-white"
    >
      <div class="flex flex-col items-center p-2">
        <i
          class="pi pi-spin pi-cog py-2 text-3xl text-LightEm dark:text-DarkEm"
        ></i>
        <div class="mb-4 truncate font-mono font-semibold underline">
          Login to edit
        </div>
        <div class="flex flex-col items-center justify-center">
          <FloatLabel class="mx-2 my-3">
            <InputText
              id="username"
              v-model="username"
              type="text"
              class="px-2 py-1"
            />
            <label
              for="username"
              style="font-size: 0.7rem; left: 0.5rem; margin-top: -0.35rem"
              >Username</label
            >
          </FloatLabel>
          <FloatLabel class="mx-2 my-3">
            <Password
              id="password"
              v-model="password"
              :feedback="false"
              :invalid="password === ''"
              toggleMask
            />
            <label
              for="password"
              style="font-size: 0.7rem; left: 0.5rem; margin-top: -0.35rem"
              >Password</label
            >
          </FloatLabel>
          <Button
            class="mx-2 my-3 w-full"
            label="Login"
            severity="success"
            icon="pi pi-check"
            :disabled="username === '' || password === ''"
            @click="handleLogin"
            size="small"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
});
import { ref } from "vue";
import type { LoginParams, LoginResultModel } from "model/Login";

const username = ref<string>("");
const password = ref<string>("");
// 实例化 store
const userStore = useUserStore();
const { encryptContent } = useEncrypt();
// 吐司组件
const toastService = useToast();

const handleLogin = async () => {
  //获取加密后的用户名和密码
  const params: LoginParams = await encryptContent(
    username.value,
    password.value,
  );
  // 调用store实例中登录接口,获取token
  const userInfo: LoginResultModel = await userStore.login(params);
  if (userInfo) {
    toastService.add({
      severity: "success",
      summary: "登录成功",
      detail: `欢迎回来~,${userStore.userInfo?.nickName || "管理员"}`,
      life: 3000,
    });
    localStorage.setItem("_token", userInfo.token);
  }
  setTimeout(async () => {
    await navigateTo("/admin/dashboard");
  }, 1000);
};
</script>

<style scoped>
:deep(#password) {
  input {
    @apply px-2 py-1;
  }
}

:deep(.p-floatlabel) {
  @apply w-full;

  .p-password {
    @apply w-full;
  }

  .p-inputtext {
    @apply w-full;
  }
}
</style>
