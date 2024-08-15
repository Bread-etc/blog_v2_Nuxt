/**
 * 获取公钥接口
 */
import { useHttp } from "~/composables/useHttp";

enum Api {
  getPublicKey = "/secret/getPublicKey",
}

// 获取公钥
export async function getPublicKey() {
  return useHttp.get<string>(Api.getPublicKey);
}
