import { prisma } from "~/server/utils/db";

// 获取标签列表接口
export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const includePostCount = query.includePostCount === "true";
    const skip = (page - 1) * limit;

    // 查询标签列表
    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        orderBy: [{ name: "asc" }],
        skip,
        take: limit,
        include: includePostCount
          ? {
              posts: {
                select: { postId: true },
              },
            }
          : undefined,
      }),
      prisma.tag.count(),
    ]);

    // 处理返回数据
    const result = includePostCount
      ? tags.map((tag) => {
          const { posts, ...tagData } = tag as any;
          return {
            ...tagData,
            postCount: posts?.length || 0,
          };
        })
      : tags;

    // 分页信息
    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };

    return createSuccessResponse(
      {
        tags: result,
        pagination,
      },
      "获取标签列表成功",
      200,
    );
  } catch (error: any) {
    return createErrorResponse("获取标签列表失败:" + error, 500, false);
  }
});
