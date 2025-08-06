// 通用类型
export * from "./common";

// 认证相关类型
export * from "./auth";

// 分类相关类型
export * from "./category";

// 文章相关类型
export * from "./post";

// 标签相关类型
export * from "./tag";

// API 接口类型定义
export interface ApiEndpoints {
  // 认证接口
  auth: {
    login: "/api/auth/login";
    validate: "/api/auth/validate";
  };

  // 分类接口
  categories: {
    list: "/api/categories";
    detail: "/api/categories/[id]";
    create: "/api/categories/create";
    update: "/api/categories/update";
    delete: "/api/categories/delete";
    stats: "/api/categories/stats";
  };

  // 文章接口
  posts: {
    list: "/api/posts";
    detail: "/api/posts/[id]";
    create: "/api/posts/create";
    update: "/api/posts/update";
    delete: "/api/posts/delete";
    search: "/api/posts/search";
    stats: "/api/posts/stats";
    batch: "/api/posts/batch";
    recommended: "/api/posts/recommended";
    updateView: "/api/posts/update-view";
  };

  // 标签接口
  tags: {
    list: "/api/tags";
    detail: "/api/tags/[id]";
    create: "/api/tags/create";
    update: "/api/tags/update";
    delete: "/api/tags/delete";
    stats: "/api/tags/stats";
    batch: "/api/tags/batch";
  };
}

// HTTP 方法类型
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// API 请求配置类型
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
  headers?: Record<string, string>;
}

// 错误响应类型
export interface ApiError {
  code: number;
  message: string;
  success: false;
  data?: any;
}

// 成功响应类型
export interface ApiSuccess<T = any> {
  code: 200;
  message: string;
  success: true;
  data: T;
}

// 联合响应类型
export type ApiResult<T = any> = ApiSuccess<T> | ApiError;
