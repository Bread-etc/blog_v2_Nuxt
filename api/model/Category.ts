/**
 * 分类结构
 */

// 获取单个标签
export interface Category extends CategoryWithoutId {
  id: number;
}

export interface CategoryWithoutId {
  name: string;
  color?: string;
  icon?: string;
}
