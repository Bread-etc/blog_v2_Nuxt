import { useApi } from "~/composables/index";
import type { LoginParams, LoginResultModel } from "model/Login";
import { computed, ref } from "vue";

function storeSetup() {
  // 用户信息
  const userInfo = ref<LoginResultModel>();
  // 获取用户信息方法
  const getUserInfo = computed(() => userInfo.value);
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
    getUserInfo,
    getToken,
    isLogin,
    clearUserInfo,
    setUserInfo,
  };
}

export const useUserStore = defineStore("userStore", storeSetup, {
  persist: true,
});
