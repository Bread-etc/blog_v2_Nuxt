import type {
  Post,
  PostWithRelations,
  PostListParams,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  DeletePostRequest,
  PostSearchParams,
  PostStats,
  BatchUpdatePostsRequest,
  BatchUpdatePostsResponse,
  RecommendedPost,
  RecommendedPostsParams,
  UpdateViewCountRequest,
} from "~/types";

/**
 * 文章服务 - 提供文章相关的API操作
 */
export const usePostsService = () => {
  const { get, post } = useApi();

  /**
   * 获取文章列表
   * @param params 查询参数
   * @returns 文章列表
   */
  const getList = async (params?: PostListParams) => {
    // 构建查询字符串
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.categoryId)
      searchParams.append("categoryId", params.categoryId.toString());
    if (params?.tagId) searchParams.append("tagId", params.tagId.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo);

    const queryString = searchParams.toString();
    const url = queryString ? `/api/posts?${queryString}` : "/api/posts";

    return await get<PostListResponse>(url, {
      showErrorToast: true,
    });
  };

  /**
   * 获取文章详情
   * @param slug 文章标识符
   * @returns 文章详情
   */
  const getDetail = async (slug: string) => {
    return await get<PostWithRelations>(`/api/posts/${slug}`, {
      showErrorToast: true,
    });
  };

  /**
   * 创建文章
   * @param data 文章数据
   * @param loading 加载状态
   * @returns 创建结果
   */
  const create = async (data: CreatePostRequest, loading?: Ref<boolean>) => {
    return await post<Post>("/api/posts/create", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "文章创建成功",
      loading,
    });
  };

  /**
   * 更新文章
   * @param data 更新数据
   * @param loading 加载状态
   * @returns 更新结果
   */
  const update = async (data: UpdatePostRequest, loading?: Ref<boolean>) => {
    return await post<Post>("/api/posts/update", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "文章更新成功",
      loading,
    });
  };

  /**
   * 删除文章
   * @param data 删除数据
   * @param loading 加载状态
   * @returns 删除结果
   */
  const remove = async (data: DeletePostRequest, loading?: Ref<boolean>) => {
    return await post<void>("/api/posts/delete", data, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "文章删除成功",
      loading,
    });
  };

  /**
   * 搜索文章
   * @param params 搜索参数
   * @returns 搜索结果
   */
  const search = async (params: PostSearchParams) => {
    // 构建查询字符串
    const searchParams = new URLSearchParams();
    searchParams.append("keyword", params.keyword);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.categoryId)
      searchParams.append("categoryId", params.categoryId.toString());
    if (params.tagIds?.length) {
      params.tagIds.forEach((tagId) =>
        searchParams.append("tagIds", tagId.toString()),
      );
    }
    if (params.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const url = `/api/posts/search?${queryString}`;

    return await get<PostListResponse>(url, {
      showErrorToast: true,
    });
  };

  /**
   * 获取文章统计
   * @returns 统计数据
   */
  const getStats = async () => {
    return await get<PostStats>("/api/posts/stats", {
      showErrorToast: true,
    });
  };

  /**
   * 批量操作文章
   * @param data 批量操作数据
   * @param loading 加载状态
   * @returns 操作结果
   */
  const batchUpdate = async (
    data: BatchUpdatePostsRequest,
    loading?: Ref<boolean>,
  ) => {
    return await post<BatchUpdatePostsResponse>(
      "/api/posts/batch-update",
      data,
      {
        showErrorToast: true,
        showSuccessToast: true,
        successMessage: "批量操作成功",
        loading,
      },
    );
  };

  /**
   * 获取推荐文章
   * @param params 推荐参数
   * @returns 推荐文章列表
   */
  const getRecommended = async (params: RecommendedPostsParams) => {
    // 构建查询字符串
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.strategy) searchParams.append("strategy", params.strategy);

    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/posts/${params.postId}/recommended?${queryString}`
      : `/api/posts/${params.postId}/recommended`;

    return await get<RecommendedPost[]>(url, {
      showErrorToast: true,
    });
  };

  /**
   * 更新文章浏览量
   * @param data 浏览量更新数据
   * @returns 更新结果
   */
  const updateViewCount = async (data: UpdateViewCountRequest) => {
    return await post<void>(
      `/api/posts/${data.id}/view`,
      {},
      {
        showErrorToast: false, // 浏览量更新失败不显示错误
      },
    );
  };

  return {
    getList,
    getDetail,
    create,
    update,
    remove,
    search,
    getStats,
    batchUpdate,
    getRecommended,
    updateViewCount,
  };
};
