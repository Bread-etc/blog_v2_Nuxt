import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 创建文章
export default defineEventHandler(async (event) => {
  try {
    // 身份验证
    const authResult = await authenticateUser(event);
    if (!authResult.success) {
      return authResult.error;
    }
    const currentUser = authResult.user!;

    // 获取请求参数
    const {
      title,
      markdownContent,
      htmlContent,
      excerpt,
      featuredImageUrl,
      status,
      publishedAt,
      readingTime,
      categoryIds,
      tagIds,
    } = await readBody(event);

    // 参数验证
    if (!title || !markdownContent || !htmlContent) {
      return useErrorWrapper(
        "",
        400,
        false,
        "标题、markdown内容和html内容是必填字段",
      );
    }

    // 验证状态值
    const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    const postStatus =
      status && validStatuses.includes(status) ? status : "DRAFT";

    // 生成slug（使用时间戳）
    const timestamp = Date.now();
    const slug = `post-${timestamp}`;

    // 自动生成摘要（如果没有提供）
    let postExcerpt = excerpt;
    if (!postExcerpt) {
      // 从markdown内容中提取前150个字符作为摘要
      const plainText = markdownContent
        .replace(/#{1,6}\s+/g, "") // 移除标题标记
        .replace(/\*\*(.*?)\*\*/g, "$1") // 移除粗体
        .replace(/\*(.*?)\*/g, "$1") // 移除斜体
        .replace(/`(.*?)`/g, "$1") // 移除代码标记
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除链接，保留文本
        .trim();

      postExcerpt =
        plainText.length > 150
          ? plainText.substring(0, 150) + "..."
          : plainText;
    }

    // 处理发布时间
    let actualPublishedAt = null;
    if (postStatus === "PUBLISHED") {
      actualPublishedAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        markdownContent,
        htmlContent,
        excerpt: postExcerpt,
        featuredImageUrl: featuredImageUrl || null,
        status: postStatus,
        publishedAt: actualPublishedAt,
        readingTime: readingTime || null,
        authorId: currentUser.userId,
        // 分类关联
        categories:
          categoryIds && categoryIds.length > 0
            ? {
                create: categoryIds.map((categoryId: number) => ({
                  categoryId,
                })),
              }
            : undefined,
        // 标签关联
        tags:
          tagIds && tagIds.length > 0
            ? {
                create: tagIds.map((tagId: number) => ({
                  tagId,
                })),
              }
            : undefined,
      },
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

    // 处理返回数据
    const result = {
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
    };

    console.log(`用户 ${currentUser.userName} 创建了文章: ${post.title}`);

    return useResponseWrapper(result, 200, true, "文章创建成功");
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "创建文章失败");
  }
});
