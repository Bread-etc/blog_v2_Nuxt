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
        categories: true, // 包括关联的分类信息
        postFiles: true, // 包括关联的文件信息
      },
      orderBy: {
        createdTime: "desc", // 按创建时间倒序排序
      },
    });

    // 获取文章总数
    const total = await prisma.post.count();

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    // 返回分页结果
    return useResponseWrapper({
      list: articles,
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
