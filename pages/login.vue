<template>
  <div class="flex h-screen w-screen items-center">
    <!-- 左侧表单 -->
    <div class="flex-center col h-full w-1/2 p-16">
      <Card class="w-full border-none bg-transparent shadow-none">
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
          <CardDescription
            class="select-none truncate font-mono font-extrabold tracking-tight"
          >
            <a class="hover:text-primary" @click="handleBack"
              >click here come back!🧩</a
            >
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-2">
            <div class="mb-3 space-y-3">
              <Input
                class="font-bold tracking-tight"
                id="username"
                v-model="loginForm.userName"
                type="text"
                placeholder="username"
                autocomplete="username"
                :disabled="loading"
                required
              />
              <Input
                class="font-bold tracking-tight"
                id="password"
                v-model="loginForm.password"
                type="password"
                autocomplete="current-password"
                :disabled="loading"
                required
              />
            </div>
            <Button
              variant="default"
              size="sm"
              type="submit"
              :disabled="loading"
            >
              <LogIn class="h-4 w-4" />
              <span class="text-white" v-if="loading">登录中...</span>
              <span class="text-white" v-else>登录</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- 右侧图片 -->
    <div class="flex-center h-full w-1/2">
      <div
        class="flex-center h-[96%] w-[96%] rounded-md bg-gradient-to-br from-orange-400 to-orange-800"
      >
        <img
          src="~/assets/images/LoginPage.png"
          alt="Login illustration"
          class="max-h-96 object-contain"
        />
      </div>
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
import { Button } from "~/components/ui/button";
import { LogIn } from "lucide-vue-next";

useHead({ title: "登录" });

definePageMeta({
  layout: "admin",
});

// 响应式数据
const loading = ref(false);
const loginForm = reactive({
  userName: "",
  password: "",
});

// 使用认证服务
const { login, getPublicKey } = useAuthService();

// RSA加密函数 - 使用Web Crypto API
const encryptPassword = async (
  password: string,
  publicKey: string,
): Promise<string> => {
  try {
    // 将PEM格式的公钥转换为ArrayBuffer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = publicKey
      .replace(pemHeader, "")
      .replace(pemFooter, "")
      .replace(/\s/g, "");
    const binaryDer = Uint8Array.from(atob(pemContents), (c) =>
      c.charCodeAt(0),
    );

    // 导入公钥
    const cryptoKey = await crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"],
    );

    // 加密密码
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      cryptoKey,
      data,
    );

    // 转换为base64
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch (error) {
    console.error("RSA加密失败:", error);
    throw new Error("密码加密失败");
  }
};

// 登录处理函数
const handleLogin = async () => {
  if (!loginForm.userName || !loginForm.password) {
    return;
  }

  try {
    loading.value = true;

    const publicKeyResponse = await getPublicKey();
    if (publicKeyResponse.code !== 200) {
      throw new Error("获取公钥失败");
    }

    const encryptedPassword = await encryptPassword(
      loginForm.password,
      publicKeyResponse.data.publicKey,
    );

    const loginData = {
      userName: loginForm.userName,
      password: encryptedPassword,
    };

    const response = await login(loginData, loading);

    if (response.code === 200) {
      await navigateTo("/admin/dashboard");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleBack = () => {
  const router = useRouter();
  router.go(-1);
};
</script>
