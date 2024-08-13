import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useUserStore } from "~/stores/user.store";
import showToast from "~/utils/toastService";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  if (!userStore.isLogin) {
    showToast("warn", "Warn", "未登录,请登录之后访问");
    return navigateTo({ path: '/admin/login', query: { redirect: to.path }});
  }
});
