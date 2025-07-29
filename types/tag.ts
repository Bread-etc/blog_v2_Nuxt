import type {
  ID,
  Timestamp,
  PaginationParams,
  PaginationResponse,
  BatchOperation,
  BatchOperationResponse,
} from "./common";

// 标签基础类型
export interface Tag {
  id: ID;
  name: string;
  slug: string;
}

// 带文章数量的标签类型
export interface TagWithCount extends Tag {
  postCount: number;
}

// 带文章列表的标签类型
export interface TagWithPosts extends Tag {
  posts: {
    id: ID;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }[];
  postCount: number;
}

// 标签列表查询参数
export interface TagListParams extends PaginationParams {
  search?: string;
  sortBy?: "name" | "id" | "postCount";
  sortOrder?: "asc" | "desc";
  includeCount?: boolean;
}

// 标签列表响应类型
export type TagListResponse = PaginationResponse<TagWithCount>;

// 标签创建请求类型
export interface CreateTagRequest {
  name: string;
  slug?: string;
}

// 标签更新请求类型
export interface UpdateTagRequest {
  id: ID;
  name?: string;
  slug?: string;
}

// 标签删除请求类型
export interface DeleteTagRequest {
  id: ID;
}

// 标签详情查询参数
export interface TagDetailParams {
  includePosts?: boolean;
  postsPage?: number;
  postsLimit?: number;
}

// 标签统计信息类型
export interface TagStats {
  overview: {
    totalTags: number;
    tagsWithPosts: number;
    unusedTags: number;
    usageRate: number;
  };
  usageDistribution: {
    status: "used" | "unused";
    count: number;
    label: string;
  }[];
  popularTags: {
    id: ID;
    name: string;
    slug: string;
    postCount: number;
  }[];
  recentTags: {
    id: ID;
    name: string;
    slug: string;
  }[];
}

// 批量创建标签请求类型
export interface BatchCreateTagsRequest extends BatchOperation {
  action: "create";
  data: CreateTagRequest[];
}

// 批量删除标签请求类型
export interface BatchDeleteTagsRequest extends BatchOperation {
  action: "delete";
  data: ID[];
}

// 批量标签操作请求类型
export type BatchTagRequest = BatchCreateTagsRequest | BatchDeleteTagsRequest;

// 批量创建标签响应类型
export interface BatchCreateTagsResponse {
  createdCount: number;
  createdTags: Tag[];
  totalRequested: number;
}

// 批量删除标签响应类型
export interface BatchDeleteTagsResponse {
  deletedCount: number;
  deletedTags: {
    id: ID;
    name: string;
  }[];
  skippedCount: number;
  totalRequested: number;
}

// 批量标签操作响应类型
export type BatchTagResponse =
  | BatchCreateTagsResponse
  | BatchDeleteTagsResponse;
