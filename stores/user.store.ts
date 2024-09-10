import { useApi } from "~/composables/index";
import type { LoginParams, LoginResultModel } from "~/api/model/Login";
import { computed, ref } from "vue";
import { defineStore } from "pinia";

function storeSetup() {
  // 用户信息
  const userInfo = ref<LoginResultModel>();
  // 是否登录
  const isLogin = computed(() => !!userInfo.value?.token);
  // 获取令牌token
  const getToken = computed(() => userInfo.value?.token);
  // 设置用户信息
  const setUserInfo = (info: LoginResultModel) => {
    userInfo.value = info;
  };

  // 登录
  const login = async (params: LoginParams) => {
    clearUserInfo();
    const { login } = useApi();
    const { data } = await login.login(params);
    userInfo.value = data;
    return data;
  };

  // 清除登录信息
  const clearUserInfo = () => {
    userInfo.value = undefined;
  };

  // 登出
  const logout = async () => {
    const { login } = useApi();
    await login.logout();
    clearUserInfo();
  };

  return {
    userInfo,
    login,
    logout,
    getToken,
    isLogin,
    clearUserInfo,
    setUserInfo,
  };
}

export const useUserStore = defineStore("userStore", storeSetup);
