import type {
  Tag,
  TagWithCount,
  CreateTagRequest,
  UpdateTagRequest,
  DeleteTagRequest,
  TagStats,
  BatchTagRequest,
  BatchTagResponse,
  PaginationResponse,
} from "~/types";

/**
 * 标签服务 - 提供标签相关的API操作
 */
export const useTagsService = () => {
  const { get, post } = useApi();

  /**
   * 获取标签列表
   * @param params 查询参数
   * @returns 标签列表
   */
  const getList = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    includeCount?: boolean;
  }) => {
    // 构建查询字符串
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.includeCount)
      searchParams.append("includeCount", params.includeCount.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `/api/tags?${queryString}` : "/api/tags";

    return await get<PaginationResponse<TagWithCount>>(url, {
      showErrorToast: true,
    });
  };

  /**
   * 获取标签详情
   * @param id 标签ID
   * @returns 标签详情
   */
  const getDetail = async (id: number) => {
    return await get<TagWithCount>(`/api/tags/${id}`, {
      showErrorToast: true,
    });
  };

  /**
   * 获取标签统计
   * @returns 统计数据
   */
  const getStats = async () => {
    return await get<TagStats>("/api/tags/stats", {
      showErrorToast: true,
    });
  };

  /**
   * 创建标签
   * @param data 标签数据
   * @param loading 加载状态
   * @returns 创建结果
   */
  const create = async (data: CreateTagRequest, loading?: Ref<boolean>) => {
    return await post<Tag>("/api/tags/create", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "标签创建成功",
      loading,
    });
  };

  /**
   * 更新标签
   * @param data 更新数据
   * @param loading 加载状态
   * @returns 更新结果
   */
  const update = async (data: UpdateTagRequest, loading?: Ref<boolean>) => {
    return await post<Tag>("/api/tags/update", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "标签更新成功",
      loading,
    });
  };

  /**
   * 删除标签
   * @param data 删除数据
   * @param loading 加载状态
   * @returns 删除结果
   */
  const remove = async (data: DeleteTagRequest, loading?: Ref<boolean>) => {
    return await post<void>("/api/tags/delete", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "标签删除成功",
      loading,
    });
  };

  /**
   * 批量操作标签
   * @param data 批量操作数据
   * @param loading 加载状态
   * @returns 操作结果
   */
  const batch = async (data: BatchTagRequest, loading?: Ref<boolean>) => {
    return await post<BatchTagResponse>("/api/tags/batch", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "批量操作成功",
      loading,
    });
  };

  return {
    getList,
    getDetail,
    getStats,
    create,
    update,
    remove,
    batch,
  };
};
