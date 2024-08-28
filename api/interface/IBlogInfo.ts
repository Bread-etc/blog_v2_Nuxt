/**
 * 博客首页主要内容接口
 */
import { useHttp } from "~/composables/useHttp";
import type { ArticleList, ArticleListParams } from "model/BlogInfo";

enum Api {
  getList = "/post/getArticleList",
  searchArticle = "/post/search",
}

// 获取文章列表
export async function getList(params: ArticleListParams) {
  return useHttp.get<ArticleList>(Api.getList, params);
}

// 获取指定id的文章
export async function getArticle(params: { id: number }) {
  return useHttp.post<ArticleList>(Api.searchArticle, params);
}
