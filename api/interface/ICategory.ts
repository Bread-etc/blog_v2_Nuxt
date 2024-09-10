/**
 * 标签/分类crud接口
 */
import { useHttp } from "~/composables/useHttp";
import type { Category, CategoryWithoutId } from "~/api/model/Category";

enum Api {
  getList = "/category/getList",
  create = "/category/create",
  update = "/category/update",
  delete = "/category/delete",
}

export async function getList() {
  return useHttp.get<Category[]>(Api.getList);
}

export async function createTag(params: CategoryWithoutId) {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return useHttp.post<string>(Api.create, params, token);
}

export async function updateTag(params: Category) {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return useHttp.post<string>(Api.update, params, token);
}

export async function deleteTag(params: { id: number }) {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return useHttp.post<string>(Api.delete, params, token);
}
