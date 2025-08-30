import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PaginationResponse,
} from "~/types";

/**
 * 分类服务 - 提供分类相关的API操作
 */
export const useCategoriesService = () => {
  const { get, post } = useApi();

  /**
   * 获取分类列表
   * @param params 查询参数
   * @returns 分类列表
   */
  const getList = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    // 构建查询字符串
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/categories?${queryString}`
      : "/api/categories";

    return await get<PaginationResponse<Category>>(url, {
      showErrorToast: true,
    });
  };

  /**
   * 获取分类详情
   * @param id 分类ID
   * @returns 分类详情
   */
  const getDetail = async (id: number) => {
    return await get<Category>(`/api/categories/${id}`, {
      showErrorToast: true,
    });
  };

  /**
   * 创建分类
   * @param data 分类数据
   * @param loading 加载状态
   * @returns 创建结果
   */
  const create = async (
    data: CreateCategoryRequest,
    loading?: Ref<boolean>,
  ) => {
    return await post<Category>("/api/categories/create", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "分类创建成功",
      loading,
    });
  };

  /**
   * 更新分类
   * @param data 更新数据
   * @param loading 加载状态
   * @returns 更新结果
   */
  const update = async (
    data: UpdateCategoryRequest,
    loading?: Ref<boolean>,
  ) => {
    return await post<Category>("/api/categories/update", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "分类更新成功",
      loading,
    });
  };

  /**
   * 删除分类
   * @param data 删除数据
   * @param loading 加载状态
   * @returns 删除结果
   */
  const remove = async (data: { id: number }, loading?: Ref<boolean>) => {
    return await post<void>(
      "/api/categories/delete",
      data,
      {
        showErrorToast: true,
        showSuccessToast: true,
        successMessage: "分类删除成功",
        loading,
      },
    );
  };

  return {
    getList,
    getDetail,
    create,
    update,
    remove,
  };
};
