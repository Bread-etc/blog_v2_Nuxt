import { prisma } from "~/server/utils/db";

// 高级搜索接口
export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数
    const query = getQuery(event);

    // 分页参数
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 搜索参数
    const keyword = query.keyword as string;
    const categoryId = query.categoryId
      ? parseInt(query.categoryId as string)
      : undefined;
    const tagId = query.tagId ? parseInt(query.tagId as string) : undefined;
    const status = (query.status as string) || "PUBLISHED";
    const dateFrom = query.dateFrom as string;
    const dateTo = query.dateTo as string;
    const sortBy = (query.sortBy as string) || "publishedAt";
    const sortOrder = (query.sortOrder as string) || "desc";

    // 参数验证
    if (!keyword || keyword.trim().length < 2) {
      return createErrorResponse("搜索关键词至少需要2个字符", 400, false);
    }

    // 构建查询条件
    const where: any = {
      status: status,
    };

    // 关键词搜索（标题、摘要、内容）
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { excerpt: { contains: keyword, mode: "insensitive" } },
        { markdownContent: { contains: keyword, mode: "insensitive" } },
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

    // 时间范围筛选
    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) {
        where.publishedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.publishedAt.lte = new Date(dateTo);
      }
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

    // 执行搜索
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

    // 处理搜索结果，添加关键词高亮信息
    const results = posts.map((post) => {
      // 简单的关键词匹配标记
      const titleMatch = post.title
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const excerptMatch =
        post.excerpt?.toLowerCase().includes(keyword.toLowerCase()) || false;

      return {
        ...post,
        categories: post.categories.map((pc) => pc.category),
        tags: post.tags.map((pt) => pt.tag),
        // 移除完整内容
        markdownContent: undefined,
        htmlContent: undefined,
        // 添加匹配信息
        matchInfo: {
          titleMatch,
          excerptMatch,
          keyword: keyword,
        },
      };
    });

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
        posts: results,
        pagination,
        searchInfo: {
          keyword,
          categoryId,
          tagId,
          dateFrom,
          dateTo,
          total,
        },
      },
      `找到 ${total} 篇相关文章`,
      200,
    );
  } catch (error: any) {
    return createErrorResponse("搜索文章失败:" + error, 500, false);
  }
});
