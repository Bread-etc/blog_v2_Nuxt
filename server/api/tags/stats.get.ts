import { prisma } from "~/server/utils/db";

// 标签统计信息接口
export default defineEventHandler(async (event) => {
  try {
    const [totalTags, tagsWithPosts, unusedTags, popularTags, recentTags] =
      await Promise.all([
        // 总标签数
        prisma.tag.count(),
        // 有文章的标签数
        prisma.tag.count({
          where: {
            posts: {
              some: {
                post: { status: "PUBLISHED" },
              },
            },
          },
        }),
        // 未使用的标签数
        prisma.tag.count({
          where: {
            posts: {
              none: {},
            },
          },
        }),
        // 最受欢迎的10个标签（按文章数量）
        prisma.tag.findMany({
          include: {
            posts: {
              where: {
                post: { status: "PUBLISHED" },
              },
              select: { postId: true },
            },
          },
          orderBy: {
            name: "asc",
          },
        }),
        // 最近创建的5个标签
        prisma.tag.findMany({
          orderBy: { id: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            slug: true,
          },
        }),
      ]);

    // 处理热门标签数据
    const processedPopularTags = popularTags
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        postCount: tag.posts.length,
      }))
      .filter((tag) => tag.postCount > 0)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 10);

    // 构建统计结果
    const stats = {
      // 基础统计
      overview: {
        totalTags,
        tagsWithPosts,
        unusedTags,
        usageRate:
          totalTags > 0 ? Math.round((tagsWithPosts / totalTags) * 100) : 0,
      },

      // 使用分布
      usageDistribution: [
        { status: "used", count: tagsWithPosts, label: "已使用" },
        { status: "unused", count: unusedTags, label: "未使用" },
      ],

      // 热门标签
      popularTags: processedPopularTags,

      // 最近标签
      recentTags: recentTags,
    };

    return createSuccessResponse(stats, "获取标签统计信息成功", 200);
  } catch (error: any) {
    return createErrorResponse("获取标签统计信息失败:" + error, 500, false);
  }
});
