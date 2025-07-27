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

    // 获取请求参数
    const { id } = await readBody(event);

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
      select: {
        id: true,
        title: true,
        authorId: true,
        status: true,
      },
    });

    if (!existingPost) {
      return useErrorWrapper("", 404, false, "文章不存在");
    }

    // 检查权限（只有作者可以删除）
    if (existingPost.authorId !== currentUser.userId) {
      return useErrorWrapper("", 403, false, "无权限删除此文章");
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

    return useResponseWrapper(
      {
        deletedId: postId,
        deletedTitle: existingPost.title,
        newStatus: deletedPost.status,
      },
      200,
      true,
      "文章删除成功",
    );
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2025") {
      return useErrorWrapper("", 404, false, "文章不存在");
    }

    return useErrorWrapper(error, 500, false, "删除文章失败");
  }
});
