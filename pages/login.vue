<template>
  <div class="flex h-screen w-screen items-center">
    <!-- 左侧表单 -->
    <div class="flex-center h-full w-1/2 p-16">
      <Card class="w-full border-none bg-transparent">
        <CardHeader>
          <CardTitle class="select-none text-3xl font-bold">Hello🎉</CardTitle>
          <CardTitle class="select-none text-3xl font-bold"
            >Welcome Back</CardTitle
          >
          <CardDescription
            class="select-none truncate font-mono font-extrabold tracking-tight"
          >
            Hey, sign in to manage blogs💡
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-2">
            <div class="space-y-3">
              <Input
                class="font-bold tracking-tight"
                id="username"
                v-model="loginForm.userName"
                type="text"
                placeholder="username"
                :disabled="loading"
                required
              />
              <Input
                class="font-bold tracking-tight"
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="******"
                :disabled="loading"
                required
              />
            </div>
            <div class="flex items-center space-x-2 p-1">
              <input
                id="remember"
                type="checkbox"
                v-model="memoPassword"
                class="mt-[2px] h-4 w-4"
              />
              <Label for="remember" class="select-none text-sm">记住密码</Label>
            </div>
            <Button
              variant="default"
              size="sm"
              class="w-1/4"
              type="submit"
              :disabled="loading"
            >
              <span class="text-white" v-if="loading">登录中...</span>
              <span class="text-white" v-else>登录</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- 右侧图片 -->
    <div
      class="flex-center mr-1 h-[98%] w-1/2 rounded-lg bg-gradient-to-br from-orange-400 to-orange-700"
    >
      <img
        src="~/assets/images/LoginPage.png"
        alt="Login illustration"
        class="max-h-96 object-contain"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

useHead({ title: "登录" });

definePageMeta({
  layout: "admin",
});

// 响应式数据
const loading = ref(false);
const memoPassword = ref(false);
const loginForm = reactive({
  userName: "",
  password: "",
});

// 使用认证服务
const { login } = useAuthService();

// 登录处理函数
const handleLogin = async () => {
  if (!loginForm.userName || !loginForm.password) {
    return;
  }

  try {
    loading.value = true;
    const response = await login(loginForm, loading);

    if (response.code === 200) {
      // 登录成功，跳转到管理后台
      await navigateTo("/admin");
    }
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    loading.value = false;
  }
};
</script>
