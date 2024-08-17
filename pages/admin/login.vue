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
              style="padding: 0.25rem 0.5rem"
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
            class="mx-2 my-3 w-4/5"
            label="Login"
            severity="success"
            icon="pi pi-check"
            @click="handleLogin"
            size="small"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { LoginParams } from "model/Login";
import { useEncrypt } from "~/composables";
import { useUserStore } from "~/stores/user.store";
import { navigateTo } from "nuxt/app";

const username = ref<string>("");
const password = ref<string>("");
// 实例化 store
const userStore = useUserStore();
const { encryptContent } = useEncrypt();
// 吐司组件
const toastService = usePVToastService();

const handleLogin = async () => {
  // 获取加密后的用户名和密码
  const encryptedUsername = await encryptContent(username.value);
  const encryptedPassword = await encryptContent(password.value);
  const params: LoginParams = {
    username: encryptedUsername,
    password: encryptedPassword,
  };
  // 调用store势力中登录接口,获取token
  const token: string = await userStore.login(params);
  if (token) {
    toastService.add({
      severity: "success",
      summary: "登录成功",
      detail: `欢迎回来~,${userStore.userInfo?.nick_name || "管理员"}`,
      life: 3000,
    });
    navigateTo("/admin/dashboard");
  }
};
</script>

<style scoped>
:deep(#password) {
  input {
    padding: 0.25rem 0.5rem;
  }
}
</style>
