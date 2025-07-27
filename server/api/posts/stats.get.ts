import { prisma } from "~/server/utils/db";

// 文章统计信息接口
export default defineEventHandler(async (event) => {
  try {
    // 并发查询各种统计数据
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalViews,
      thisMonthPosts,
      popularPosts,
      recentPosts,
    ] = await Promise.all([
      // 总文章数
      prisma.post.count(),

      // 已发布文章数
      prisma.post.count({
        where: { status: "PUBLISHED" },
      }),

      // 草稿文章数
      prisma.post.count({
        where: { status: "DRAFT" },
      }),

      // 已归档文章数
      prisma.post.count({
        where: { status: "ARCHIVED" },
      }),

      // 总浏览量
      prisma.post.aggregate({
        _sum: { viewCount: true },
      }),

      // 本月新增文章数
      prisma.post.count({
        where: {
          createdTime: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // 最受欢迎的5篇文章
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { viewCount: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          publishedAt: true,
        },
      }),

      // 最近发布的5篇文章
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
          viewCount: true,
        },
      }),
    ]);

    // 构建统计结果
    const stats = {
      // 基础统计
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        archivedPosts,
        totalViews: totalViews._sum.viewCount || 0,
        thisMonthPosts,
      },

      // 状态分布
      statusDistribution: [
        { status: "PUBLISHED", count: publishedPosts, label: "已发布" },
        { status: "DRAFT", count: draftPosts, label: "草稿" },
        { status: "ARCHIVED", count: archivedPosts, label: "已归档" },
      ],

      // 热门文章
      popularPosts: popularPosts.map((post) => ({
        ...post,
        publishedAt: post.publishedAt?.toISOString(),
      })),

      // 最近文章
      recentPosts: recentPosts.map((post) => ({
        ...post,
        publishedAt: post.publishedAt?.toISOString(),
      })),
    };

    return useResponseWrapper(stats, 200, true, "获取文章统计信息成功");
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "获取文章统计信息失败");
  }
});
