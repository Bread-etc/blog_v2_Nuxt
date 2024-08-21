/**
 * 博客结构
 */

// 获取单个文章详细信息 [用于渲染table和card]
export interface ArticleInfo {
  id: number;
  title: string;
  content?: string;
  authorId: number;
  categories: Category[]; // 支持多分类
  createdTime: Date | string;
  updatedTime: Date | string;
  status: boolean;
}

// 获取单个文章文件 [用于content渲染markdown]
export interface ArticleFile {
  id: number;
  postId: number;
  fileName: string;
  fileAddress: string;
}

// 获取分类/标签列表 [categoryId = id]
export interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}