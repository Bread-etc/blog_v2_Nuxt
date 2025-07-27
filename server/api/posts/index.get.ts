import { prisma } from "~/server/utils/db";

// 获取文章列表
export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数
    const query = getQuery(event);

    // 分页参数
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 筛选参数
    const status = query.status as string;
    const categoryId = query.categoryId
      ? parseInt(query.categoryId as string)
      : undefined;
    const tagId = query.tagId ? parseInt(query.tagId as string) : undefined;
    const keyword = query.keyword as string;
    const sortBy = (query.sortBy as string) || "publishedAt";
    const sortOrder = (query.sortOrder as string) || "desc";

    // 构建查询条件
    const where: any = {};

    // 状态筛选
    if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      where.status = status;
    }

    // 关键词搜索（标题和摘要）
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { excerpt: { contains: keyword, mode: "insensitive" } },
      ];
    }

    // 分类筛选
    if (categoryId) {
      where.categories = {
        some: { categoryId: categoryId },
      };
    }

    // 标签筛选
    if (tagId) {
      where.tags = {
        some: { tagId: tagId },
      };
    }

    // 排序配置
    const orderBy: any = {};
    if (sortBy === "publishedAt") {
      orderBy.publishedAt = sortOrder;
    } else if (sortBy === "viewCount") {
      orderBy.viewCount = sortOrder;
    } else if (sortBy === "createdTime") {
      orderBy.createdTime = sortOrder;
    } else {
      orderBy.publishedAt = "desc";
    }

    // 查询文章列表和总数
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      }),
      prisma.post.count({ where }),
    ]);

    // 处理返回数据
    const result = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImageUrl: post.featuredImageUrl,
      viewCount: post.viewCount,
      status: post.status,
      publishedAt: post.publishedAt,
      createdTime: post.createdTime,
      updatedTime: post.updatedTime,
      readingTime: post.readingTime,
      author: post.author,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
    }));

    // 分页信息
    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };

    return useResponseWrapper(
      {
        posts: result,
        pagination,
      },
      200,
      true,
      "获取文章列表成功",
    );
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "获取文章列表失败");
  }
});
