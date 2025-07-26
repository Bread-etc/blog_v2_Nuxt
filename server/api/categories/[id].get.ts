import { prisma } from "~/server/utils/db";

/**
 * 获取单个分类详情
 */
export default defineEventHandler(async (event) => {
  try {
    // 获取路由参数
    const id = getRouterParam(event, 'id');
    
    // 参数验证
    if (!id) {
      return useErrorWrapper("", 400, false, "分类ID是必填字段");
    }

    // 验证ID格式
    const categoryId = parseInt(id);
    if (isNaN(categoryId) || categoryId <= 0) {
      return useErrorWrapper("", 400, false, "无效的分类ID");
    }

    // 获取查询参数
    const query = getQuery(event);
    const includePosts = query.includePosts === 'true';

    // 查询分类详情
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: includePosts ? {
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
                    nickName: true
                  }
                }
              }
            }
          }
        }
      } : undefined
    });

    if (!category) {
      return useErrorWrapper("", 404, false, "分类不存在");
    }

    // 处理返回数据
    let result: any = category;
    
    if (includePosts) {
      // 使用类型断言来处理 posts 属性
      const categoryWithPosts = category as any;
      
      // 只返回已发布的文章
      const publishedPosts = categoryWithPosts.posts
        ?.filter((pc: any) => pc.post.status === 'PUBLISHED')
        .map((pc: any) => pc.post) || [];
      
      result = {
        ...category,
        posts: publishedPosts,
        postCount: publishedPosts.length
      };
    } else {
      // 如果不包含文章列表，至少返回文章数量
      const postCount = await prisma.postCategory.count({
        where: { 
          categoryId: categoryId,
          post: { status: 'PUBLISHED' }
        }
      });
      
      result = {
        ...category,
        postCount
      };
    }

    return useResponseWrapper(result, 200, true, "获取分类详情成功");
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "获取分类详情失败");
  }
});