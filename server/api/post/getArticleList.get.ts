import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 有分页的博客文章接口获取
export default defineEventHandler(async (event) => {
  // 获取查询参数
  const { page = "1", limit = "10" } = getQuery(event);

  // 当前页数和每页记录数
  const currentPage = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);

  // 计算跳过的记录数量
  const skip = (currentPage - 1) * pageSize;

  try {
    // 获取文章列表并进行分页
    const articles = await prisma.post.findMany({
      skip,
      take: pageSize,
      include: {
        postFiles: true, // 包括关联的文件信息
        PostCategory: {
          include: {
            category: true, // 获取关丽娜的分类信息
          },
        },
      },
      orderBy: {
        createdTime: "asc", // 按创建时间升序排序
      },
    });

    // 处理文章中的分类信息
    const processedArticles = articles.map((article) => ({
      ...article,
      categories: article.PostCategory.map((pc) => pc.category), // 提取分类信息
    }));

    // 获取文章总数
    const total = await prisma.post.count();

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    // 返回分页结果
    return useResponseWrapper({
      list: processedArticles,
      meta: {
        currentPage,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return useErrorWrapper(error, 500, false, "Get article list failed");
  }
});
