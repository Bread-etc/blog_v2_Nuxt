import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 更新文章接口
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
      id,
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
    if (!id) {
      return useErrorWrapper("", 400, false, "文章ID是必填字段");
    }

    // 验证ID格式
    const postId = parseInt(id);
    if (isNaN(postId) || postId <= 0) {
      return useErrorWrapper("", 400, false, "无效的文章ID");
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true, authorId: true, publishedAt: true },
    });

    if (!existingPost) {
      return useErrorWrapper("", 404, false, "文章不存在");
    }

    // 检查权限（只有作者可以修改）
    if (existingPost.authorId !== currentUser.userId) {
      return useErrorWrapper("", 403, false, "无权限修改此文章");
    }

    // 构建更新数据对象
    const updateData: any = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return useErrorWrapper("", 400, false, "文章标题不能为空");
      }
      updateData.title = title.trim();
    }

    if (markdownContent !== undefined) {
      updateData.markdownContent = markdownContent;
    }

    if (htmlContent !== undefined) {
      updateData.htmlContent = htmlContent;
    }

    if (excerpt !== undefined) {
      updateData.excerpt = excerpt;
    }

    if (featuredImageUrl !== undefined) {
      updateData.featuredImageUrl = featuredImageUrl || null;
    }

    if (status !== undefined) {
      const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
      if (status && !validStatuses.includes(status)) {
        return useErrorWrapper("", 400, false, "无效的文章状态");
      }
      updateData.status = status;

      // 处理发布时间
      if (status === "PUBLISHED" && !existingPost.publishedAt) {
        updateData.publishedAt = publishedAt
          ? new Date(publishedAt)
          : new Date();
      }
    }

    if (readingTime !== undefined) {
      updateData.readingTime = readingTime || null;
    }

    // 检查是否有字段需要更新
    const hasDataUpdate = Object.keys(updateData).length > 0;
    const hasCategoryUpdate = categoryIds !== undefined;
    const hasTagUpdate = tagIds !== undefined;

    if (!hasDataUpdate && !hasCategoryUpdate && !hasTagUpdate) {
      return useErrorWrapper("", 400, false, "至少需要提供一个要更新的字段");
    }

    // 使用事务处理更新
    const result = await prisma.$transaction(async (tx) => {
      // 更新基本字段
      let updatedPost;
      if (hasDataUpdate) {
        updatedPost = await tx.post.update({
          where: { id: postId },
          data: updateData,
        });
      }

      // 更新分类关联
      if (hasCategoryUpdate) {
        // 删除现有分类关联
        await tx.postCategory.deleteMany({
          where: { postId },
        });

        // 创建新的分类关联
        if (categoryIds && categoryIds.length > 0) {
          await tx.postCategory.createMany({
            data: categoryIds.map((categoryId: number) => ({
              postId,
              categoryId,
            })),
          });
        }
      }

      // 更新标签关联
      if (hasTagUpdate) {
        // 删除现有标签关联
        await tx.postTag.deleteMany({
          where: { postId },
        });

        // 创建新的标签关联
        if (tagIds && tagIds.length > 0) {
          await tx.postTag.createMany({
            data: tagIds.map((tagId: number) => ({
              postId,
              tagId,
            })),
          });
        }
      }

      // 返回完整的文章信息
      return await tx.post.findUnique({
        where: { id: postId },
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
    });

    // 处理返回数据
    const finalResult = {
      ...result,
      categories: result!.categories.map((pc) => pc.category),
      tags: result!.tags.map((pt) => pt.tag),
    };

    console.log(
      `用户 ${currentUser.userName} 更新了文章: ${finalResult.title}`,
    );

    return useResponseWrapper(finalResult, 200, true, "文章更新成功");
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2025") {
      return useErrorWrapper("", 404, false, "文章不存在");
    }

    return useErrorWrapper(error, 500, false, "更新文章失败");
  }
});
