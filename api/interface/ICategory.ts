/**
 * 标签/分类crud接口
 */
import { useHttp } from "~/composables/useHttp";
import type { Category, CategoryWithoutId } from "model/Category";

enum Api {
  getList = "/category/getList",
  create = "/category/create",
  update = "/category/update",
  delete = "/category/delete",
}

const userStore = useUserStore();
const token = userStore.getToken;

export async function getList() {
  return useHttp.get<Category[]>(Api.getList);
}

export async function createTag(params: CategoryWithoutId) {
  return useHttp.post<string>(Api.create, params, token);
}

export async function updateTag(params: Category) {
  return useHttp.post<string>(Api.update, params, token);
}

export async function deleteTag(params: { id: number }) {
  return useHttp.post<string>(Api.delete, params, token);
}
