import { defineStore } from "pinia";

type Secret = {
  publicKey: string;
  expiry: number;
};

// 定义 Pinia store 用户管理公钥
export const useSecretStore = defineStore("secretStore", {
  state: () => ({
    publicKey: "",
    expiry: 0,
  }),
  actions: {
    setSecret(publicKey: string, expiry: number) {
      this.publicKey = publicKey;
      this.expiry = expiry;
      localStorage.setItem("secret", JSON.stringify({ publicKey, expiry }));
    },
    getSecret(): Secret | null {
      if (!this.publicKey || new Date().getTime() > this.expiry) {
        const secret = localStorage.getItem("secret");
        if (secret) {
          const secretObj: Secret = JSON.parse(secret);
          this.publicKey = secretObj.publicKey;
          this.expiry = secretObj.expiry;
        } else {
          return null;
        }
      }
      return { publicKey: this.publicKey, expiry: this.expiry };
    },
  },
});
