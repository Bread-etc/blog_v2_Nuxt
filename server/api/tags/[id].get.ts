import { prisma } from "~/server/utils/db";

// 获取单个标签详情接口
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return createErrorResponse("标签ID是必填字段", 400, false);
    }
    // 验证ID格式
    const tagId = parseInt(id);
    if (isNaN(tagId) || tagId <= 0) {
      return createErrorResponse("无效的标签ID", 400, false);
    }

    // 获取查询参数
    const query = getQuery(event);
    const includePosts = query.includePosts === "true";

    // 查询标签详情
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: includePosts
        ? {
            posts: {
              include: {
                post: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    featuredImageUrl: true,
                    viewCount: true,
                    status: true,
                    publishedAt: true,
                    createdTime: true,
                    readingTime: true,
                    author: {
                      select: {
                        id: true,
                        userName: true,
                        nickName: true,
                      },
                    },
                  },
                },
              },
            },
          }
        : undefined,
    });

    if (!tag) {
      return createErrorResponse("标签不存在", 404, false);
    }

    // 处理返回数据
    let result: any = tag;

    if (includePosts) {
      // 只返回已发布的文章
      const publishedPosts =
        (tag as any).posts
          ?.filter((pt: any) => pt.post.status === "PUBLISHED")
          .map((pt: any) => pt.post) || [];

      result = {
        ...tag,
        posts: publishedPosts,
        postCount: publishedPosts.length,
      };
    } else {
      // 如果不包含文章列表，至少返回文章数量
      const postCount = await prisma.postTag.count({
        where: {
          tagId: tagId,
          post: { status: "PUBLISHED" },
        },
      });

      result = {
        ...tag,
        postCount,
      };
    }

    return createSuccessResponse(result, "获取标签详情成功", 200);
  } catch (error: any) {
    return createErrorResponse("获取标签详情失败" + error, 500, false);
  }
});
