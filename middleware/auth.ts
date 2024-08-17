import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useUserStore } from "~/stores/user.store";

const toastService = usePVToastService();

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  if (!userStore.isLogin) {
    toastService.add({
      severity: "warn",
      summary: "Warn 😢",
      detail: "未登录,请登录之后访问",
      life: 3000,
    })
    return navigateTo({ path: '/admin/login', query: { redirect: to.path }});
  }
});
