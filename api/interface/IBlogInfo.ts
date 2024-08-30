/**
 * 博客首页主要内容接口
 */
import { useHttp } from "~/composables/useHttp";
import type { ArticleList, ArticleListParams } from "model/BlogInfo";

enum Api {
  getList = "/post/getArticleList",
  searchArticle = "/post/search",
  deleteArticle = "/post/delete",
  createArticle = "/post/create",
  updateArticle = "/post/edit",
}

// 获取文章列表
export async function getList(params: ArticleListParams) {
  return useHttp.get<ArticleList>(Api.getList, params);
}

// 获取指定id的文章
export async function getArticle(params: { id: number }) {
  return useHttp.post<ArticleList>(Api.searchArticle, params);
}

// 删除指定 id 的文章
export async function deleteArticle(params: { postId: number }) {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return useHttp.post<string>(Api.deleteArticle, params, token);
}

// 创建文章
export async function createArticle(params: FormData) {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return useHttp.post<string>(Api.createArticle, params, token);
}

// 更新文章
export async function updateArticle(params: FormData) {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return useHttp.post<string>(Api.updateArticle, params, token);
}
