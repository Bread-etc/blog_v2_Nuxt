import { prisma } from "~/server/utils/db";

// 获取文章详情
export default defineEventHandler(async (event) => {
  try {
    // 获取路由参数
    const slug = getRouterParam(event, "slug");

    // 参数验证
    if (!slug) {
      return useErrorWrapper("", 400, false, "文章slug是必填字段");
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
      return useErrorWrapper("", 404, false, "文章不存在");
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
      viewCount: post.viewCount + 1, // 返回更新后的浏览量
    };

    return useResponseWrapper(result, 200, true, "获取文章详情成功");
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "获取文章详情失败");
  }
});
