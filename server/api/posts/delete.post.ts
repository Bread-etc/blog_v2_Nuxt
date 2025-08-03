import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 删除文章
export default defineEventHandler(async (event) => {
  try {
    // 身份验证
    const authResult = await authenticateUser(event);
    if (!authResult.success) {
      return authResult.error;
    }
    const currentUser = authResult.user!;

    const { id } = await readBody(event);
    if (!id) {
      return createErrorResponse("文章ID是必填字段", 400, false);
    }

    // 验证ID格式
    const postId = parseInt(id);
    if (isNaN(postId) || postId <= 0) {
      return createErrorResponse("无效的文章ID", 400, false);
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        authorId: true,
        status: true,
      },
    });

    if (!existingPost) {
      return createErrorResponse("文章不存在", 404, false);
    }

    // 检查权限（只有作者可以删除）
    if (existingPost.authorId !== currentUser.userId) {
      return createErrorResponse("无权限删除此文章", 403, false);
    }

    // 软删除：将状态改为ARCHIVED而不是物理删除
    const deletedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: "ARCHIVED",
      },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    console.log(
      `用户 ${currentUser.userName} 删除了文章: ${existingPost.title} (ID: ${postId})`,
    );

    return createSuccessResponse(
      {
        deletedId: postId,
        deletedTitle: existingPost.title,
        newStatus: deletedPost.status,
      },
      "文章删除成功",
      200,
    );
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2025") {
      return createErrorResponse("文章不存在", 404, false);
    }

    return createErrorResponse("删除文章失败:" + error, 500, false);
  }
});
