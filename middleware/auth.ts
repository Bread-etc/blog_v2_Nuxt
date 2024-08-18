import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { usePVToastService } from "~/composables/useToastService";
import { useUserStore } from "~/stores/user.store";

const toastService = usePVToastService();

// 中间件 利用token鉴权
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (to.path.startsWith("/admin/dashboard")) {
    if (!userStore.isLogin) {
      toastService.add({
        severity: "warn",
        summary: "Warn 😢",
        detail: "未登录,请登录之后访问",
        life: 3000,
      });
      return navigateTo("/admin/login");
    }
  }
});
