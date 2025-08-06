import type { ID, Timestamp, CategoryColor } from "./common";

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
