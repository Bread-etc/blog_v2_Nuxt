/**
 * 博客结构
 */

import type { Category } from "./Category";

// 获取单个文章详细信息 [用于渲染table和card]
export interface ArticleList extends Article {
  list: Article[];
  meta: Meta;
}

// 文章展示类型
export interface articleShow {
  id: number;
  title: string;
  authorId: number;
  status: boolean;
  fileName: string;
  categories: Category[];
  createdTime: Date | string;
  updatedTime: Date | string;
}

// 单个文章信息
export interface Article extends Meta {
  id: number;
  title: string;
  content?: string;
  authorId: number;
  categories: Category[]; // 支持多分类
  createdTime: Date | string;
  updatedTime: Date | string;
  status: boolean;
  postFiles: ArticleFile[];
}

// meta 附加信息
export interface Meta {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

// 获取单个文章文件 [用于content渲染markdown]
export interface ArticleFile {
  id: number;
  postId: number;
  fileName: string;
  fileAddress: string;
}

// 获取文章列表参数
export interface ArticleListParams {
  page: number;
  limit: number;
}
