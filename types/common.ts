// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 分页参数类型
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 分页响应类型
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 文章状态枚举
export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

// 分类颜色枚举
export enum CategoryColor {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  PURPLE = "PURPLE",
  PINK = "PINK",
  INDIGO = "INDIGO",
  GRAY = "GRAY",
}

// 排序方向
export type SortOrder = "asc" | "desc";

// 通用ID类型
export type ID = number;

// 时间戳类型
export type Timestamp = string;
