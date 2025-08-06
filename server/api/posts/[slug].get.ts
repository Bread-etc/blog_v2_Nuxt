import { prisma } from "~/server/utils/db";

// 获取文章详情
export default defineEventHandler(async (event) => {
  try {
    // 获取路由参数
    const slug = getRouterParam(event, "slug");
    if (!slug) {
      return createErrorResponse("文章slug是必填字段", 400, false);
    }

    // 查询文章详情
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            userName: true,
            nickName: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return createErrorResponse("文章不存在", 404, false);
    }

    // 增加浏览量
    await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // 处理返回数据
    const result = {
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
      viewCount: post.viewCount + 1,
    };

    return createSuccessResponse(result, "获取文章详情成功", 200);
  } catch (error: any) {
    return createErrorResponse("获取文章详情失败:" + error, 500, false);
  }
});
