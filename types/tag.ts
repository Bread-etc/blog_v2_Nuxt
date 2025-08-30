import type { ID } from "./common";

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

// 批量标签操作请求类型
export type BatchTagRequest = {
  action: "create" | "delete";
  data: CreateTagRequest[] | ID[];
};

// 批量标签操作响应类型
export type BatchTagResponse = {
  createdCount?: number;
  createdTags?: Tag[];
  deletedCount?: number;
  deletedTags?: { id: ID; name: string }[];
  skippedCount?: number;
  totalRequested: number;
};
