/**
 * 博客首页主要内容接口
 */
import { useHttp } from "~/composables/useHttp";
import type { ArticleList, ArticleListParams } from "~/api/model/BlogInfo";

enum Api {
  getList = "/post/getArticleList",
  searchArticle = "/post/search",
  searchArticleById = "/post/searchById",
  deleteArticle = "/post/delete",
  createArticle = "/post/create",
  updateArticle = "/post/edit",
  getFile = "/post/getFile",
}

// 获取文章列表
export async function getList(params: ArticleListParams) {
  return useHttp.get<ArticleList>(Api.getList, params);
}

// 搜索文章
export async function searchArticle(params: { query: string }) {
  return useHttp.post<ArticleList[]>(Api.searchArticle, params);
}

// 获取指定 id 的文章
export async function searchArticleById(params: { id: number }) {
  return useHttp.post<ArticleList>(Api.searchArticleById, params);
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

// 获取指定文章文件
export async function getFile(params: { filename: string }) {
  return useHttp.post<{ content: string; toc: { label: string; index: number, id: string }[] }>(Api.getFile, params);
}

