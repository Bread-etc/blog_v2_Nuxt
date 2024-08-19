/**
 * 博客首页主要内容接口
 */
import { useHttp } from "~/composables/useHttp";
import type { ArticleFile, ArticleInfo, Category } from "model/BlogInfo";

enum Api {
  getList = "/info/getList",
  getArticle = "/info/getArticle",
  getCategory = "/info/getCategory",
}

export async function getList() {
  return useHttp.get<ArticleInfo[]>(Api.getList);
}

export async function getArticle(params: number) {
  return useHttp.post<ArticleFile>(Api.getArticle, params);
}

export async function getCategory() {
  return useHttp.get<Category[]>(Api.getCategory);
}

