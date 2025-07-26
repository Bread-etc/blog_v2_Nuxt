import { prisma } from "~/server/utils/db";

/**
 * 获取所有分类列表
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const includePostCount = query.includePostCount === "true";

    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      include: includePostCount
        ? {
            posts: {
              select: { postId: true },
            },
          }
        : undefined,
    });

    // 处理返回数据
    const result = includePostCount
      ? categories.map((category) => {
          const { posts, ...categoryData } = category as any;
          return {
            ...categoryData,
            postCount: posts?.length || 0,
          };
        })
      : categories;

    return useResponseWrapper(result, 200, true, "获取分类列表成功");
  } catch (error: any) {
    return useErrorWrapper(error, 500);
  }
});
