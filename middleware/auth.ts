import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useUserStore } from "~/stores/user.store";

// 中间件 利用token鉴权
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (to.path.startsWith("/admin/dashboard")) {
    if (!userStore.isLogin) {
      console.warn("Warn 😢, 未登录,请登录之后访问");
      return navigateTo("/admin/login");
    }
  }
});
