/**
 * 获取公钥接口
 */
import { useHttp } from "~/composables/useHttp";
import type { PublicKey } from "model/PublicKey";

enum Api {
  getPublicKey = "/getPublicKey",
}

// 获取公钥
export async function getPublicKey() {
  return useHttp.get<PublicKey>(Api.getPublicKey);
}
