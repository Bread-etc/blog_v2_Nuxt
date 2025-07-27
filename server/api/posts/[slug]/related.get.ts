import { prisma } from "~/server/utils/db";

// 获取相关文章接口
export default defineEventHandler(async (event) => {
  try {
    // 获取路由参数
    const slug = getRouterParam(event, "slug");

    if (!slug) {
      return useErrorWrapper("", 400, false, "文章slug是必填字段");
    }

    // 获取查询参数
    const query = getQuery(event);
    const limit = parseInt(query.limit as string) || 5;

    // 首先获取当前文章信息
    const currentPost = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        categories: {
          select: { categoryId: true },
        },
        tags: {
          select: { tagId: true },
        },
      },
    });

    if (!currentPost) {
      return useErrorWrapper("", 404, false, "文章不存在");
    }

    // 提取分类和标签ID
    const categoryIds = currentPost.categories.map((c) => c.categoryId);
    const tagIds = currentPost.tags.map((t) => t.tagId);

    // 构建相关文章查询条件
    const relatedConditions = [];

    // 基于分类的相关文章
    if (categoryIds.length > 0) {
      relatedConditions.push({
        categories: {
          some: {
            categoryId: { in: categoryIds },
          },
        },
      });
    }

    // 基于标签的相关文章
    if (tagIds.length > 0) {
      relatedConditions.push({
        tags: {
          some: {
            tagId: { in: tagIds },
          },
        },
      });
    }

    // 如果没有分类和标签，则按浏览量推荐
    if (relatedConditions.length === 0) {
      const popularPosts = await prisma.post.findMany({
        where: {
          id: { not: currentPost.id },
          status: "PUBLISHED",
        },
        orderBy: { viewCount: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImageUrl: true,
          viewCount: true,
          publishedAt: true,
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
        },
      });

      const result = popularPosts.map((post) => ({
        ...post,
        categories: post.categories.map((pc) => pc.category),
        relationType: "popular",
      }));

      return useResponseWrapper(result, 200, true, "获取热门推荐文章成功");
    }

    // 查询相关文章
    const relatedPosts = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: currentPost.id } },
          { status: "PUBLISHED" },
          { OR: relatedConditions },
        ],
      },
      orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImageUrl: true,
        viewCount: true,
        publishedAt: true,
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

    // 处理返回数据，标记相关性类型
    const result = relatedPosts.map((post) => {
      const postCategoryIds = post.categories.map((pc) => pc.category.id);
      const postTagIds = post.tags.map((pt) => pt.tag.id);

      // 判断相关性类型
      const hasSameCategory = categoryIds.some((id) =>
        postCategoryIds.includes(id),
      );
      const hasSameTag = tagIds.some((id) => postTagIds.includes(id));

      let relationType = "other";
      if (hasSameCategory && hasSameTag) {
        relationType = "category_and_tag";
      } else if (hasSameCategory) {
        relationType = "category";
      } else if (hasSameTag) {
        relationType = "tag";
      }

      return {
        ...post,
        categories: post.categories.map((pc) => pc.category),
        tags: post.tags.map((pt) => pt.tag),
        relationType,
      };
    });

    return useResponseWrapper(result, 200, true, "获取相关文章成功");
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "获取相关文章失败");
  }
});
