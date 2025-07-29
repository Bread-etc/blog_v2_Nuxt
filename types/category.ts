import type {
  ID,
  Timestamp,
  CategoryColor,
  PaginationParams,
  PaginationResponse,
} from "./common";

// 分类基础类型
export interface Category {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  color: CategoryColor;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 带文章数量的分类类型
export interface CategoryWithCount extends Category {
  postCount: number;
}

// 带文章列表的分类类型
export interface CategoryWithPosts extends Category {
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

// 分类列表查询参数
export interface CategoryListParams extends PaginationParams {
  search?: string;
  color?: CategoryColor;
  sortBy?: "name" | "createdAt" | "postCount";
  sortOrder?: "asc" | "desc";
  includeCount?: boolean;
}

// 分类列表响应类型
export type CategoryListResponse = PaginationResponse<CategoryWithCount>;

// 分类创建请求类型
export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  color: CategoryColor;
}

// 分类更新请求类型
export interface UpdateCategoryRequest {
  id: ID;
  name?: string;
  slug?: string;
  description?: string;
  color?: CategoryColor;
}

// 分类删除请求类型
export interface DeleteCategoryRequest {
  id: ID;
}

// 分类详情查询参数
export interface CategoryDetailParams {
  includePosts?: boolean;
  postsPage?: number;
  postsLimit?: number;
}

// 分类统计信息类型
export interface CategoryStats {
  overview: {
    totalCategories: number;
    categoriesWithPosts: number;
    emptyCategories: number;
    usageRate: number;
  };
  colorDistribution: {
    color: CategoryColor;
    count: number;
    label: string;
  }[];
  popularCategories: {
    id: ID;
    name: string;
    slug: string;
    color: CategoryColor;
    postCount: number;
  }[];
  recentCategories: {
    id: ID;
    name: string;
    slug: string;
    color: CategoryColor;
  }[];
}
