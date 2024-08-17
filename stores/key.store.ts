import { defineStore } from "pinia";

type Secret = {
  publicKey: string;
  expiry: number;
};

// 定义 Pinia store 用户管理公钥
function storeSetup() {
  // 公钥和过期时间
  const publicKey = ref<string>("");
  const expiry = ref<number>(0);

  // 设置公钥和过期时间
  const setSecret = (key: string, exp: number) => {
    publicKey.value = key;
    expiry.value = exp;
  };

  // 获取公钥和过期时间
  const getSecret = (): Secret | null => {
    if (!publicKey.value || new Date().getTime() > expiry.value) {
      return null;
    }
    return { publicKey: publicKey.value, expiry: expiry.value };
  };

  // 检测公钥是否有效
  const isPublicKeyValid = computed(
    () => !!publicKey.value && new Date().getTime() < expiry.value,
  );

  return {
    publicKey,
    expiry,
    setSecret,
    getSecret,
    isPublicKeyValid,
  };
}

export const useSecretStore = defineStore("secretStore", storeSetup, {
  persist: true,
});
