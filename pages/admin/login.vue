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
            label="login"
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
import { useApi, useEncrypt } from "~/composables";

const username = ref<string>("");
const password = ref<string>("");
const { encryptContent } = useEncrypt();
const { login } = useApi();

const handleLogin = async () => {
  // 获取加密后的用户名和密码
  const encryptedUsername = await encryptContent(username.value);
  const encryptedPassword = await encryptContent(password.value);

  // 调用登录接口,获取token
  const token = (await login.login({ username: encryptedUsername, password: encryptedPassword})).data;
};
</script>

<style scoped>
:deep(#password) {
  input {
    padding: 0.25rem 0.5rem;
  }
}
</style>
