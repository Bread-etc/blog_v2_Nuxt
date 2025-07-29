import type {
  ID,
  Timestamp,
  PostStatus,
  PaginationParams,
  PaginationResponse,
  BatchOperation,
  BatchOperationResponse,
} from "./common";
import type { Category } from "./category";

// 文章基础类型
export interface Post {
  id: ID;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: PostStatus;
  readingTime: number;
  viewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  categoryId: ID;
}

// 带关联数据的文章类型
export interface PostWithRelations extends Post {
  category: Category;
  tags: {
    id: ID;
    name: string;
    slug: string;
  }[];
}

// 文章列表项类型（简化版）
export interface PostListItem {
  id: ID;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: PostStatus;
  readingTime: number;
  viewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  category: {
    id: ID;
    name: string;
    slug: string;
    color: string;
  };
  tags: {
    id: ID;
    name: string;
    slug: string;
  }[];
}

// 文章列表查询参数
export interface PostListParams extends PaginationParams {
  status?: PostStatus;
  categoryId?: ID;
  tagId?: ID;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "viewCount" | "title";
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

// 文章列表响应类型
export type PostListResponse = PaginationResponse<PostListItem>;

// 文章创建请求类型
export interface CreatePostRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: PostStatus;
  categoryId: ID;
  tagIds?: ID[];
}

// 文章更新请求类型
export interface UpdatePostRequest {
  id: ID;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  categoryId?: ID;
  tagIds?: ID[];
}

// 文章删除请求类型
export interface DeletePostRequest {
  id: ID;
}

// 文章搜索参数
export interface PostSearchParams extends PaginationParams {
  keyword: string;
  status?: PostStatus;
  categoryId?: ID;
  tagIds?: ID[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "relevance" | "createdAt" | "viewCount";
  sortOrder?: "asc" | "desc";
}

// 文章统计信息类型
export interface PostStats {
  overview: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    archivedPosts: number;
    totalViews: number;
    averageReadingTime: number;
  };
  statusDistribution: {
    status: PostStatus;
    count: number;
    label: string;
  }[];
  categoryDistribution: {
    categoryId: ID;
    categoryName: string;
    count: number;
  }[];
  monthlyStats: {
    month: string;
    publishedCount: number;
    totalViews: number;
  }[];
  popularPosts: {
    id: ID;
    title: string;
    slug: string;
    viewCount: number;
    publishedAt: Timestamp;
  }[];
  recentPosts: {
    id: ID;
    title: string;
    slug: string;
    status: PostStatus;
    createdAt: Timestamp;
  }[];
}

// 批量更新文章请求类型
export interface BatchUpdatePostsRequest extends BatchOperation {
  action: "updateStatus" | "updateCategory" | "addTags" | "removeTags";
  data: ID[];
  updateData: {
    status?: PostStatus;
    categoryId?: ID;
    tagIds?: ID[];
  };
}

// 批量更新文章响应类型
export interface BatchUpdatePostsResponse
  extends BatchOperationResponse<PostListItem> {
  updatedCount: number;
  updatedPosts: PostListItem[];
}

// 推荐文章类型
export interface RecommendedPost {
  id: ID;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  readingTime: number;
  viewCount: number;
  publishedAt: Timestamp;
  category: {
    id: ID;
    name: string;
    slug: string;
    color: string;
  };
}

// 推荐文章查询参数
export interface RecommendedPostsParams {
  postId: ID;
  limit?: number;
  strategy?: "category" | "tags" | "mixed";
}

// 文章浏览量更新请求
export interface UpdateViewCountRequest {
  id: ID;
}
