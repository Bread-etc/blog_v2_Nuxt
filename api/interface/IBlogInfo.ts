/**
 * 博客首页主要内容接口
 */
import { useHttp } from "~/composables/useHttp";
import type { BlogInfo } from "model/BlogInfo";

enum Api {
  getList = "/getList",
}

export async function getList() {
  return useHttp.get<BlogInfo>(Api.getList);
}
