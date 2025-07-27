import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 批量更新文章状态接口
export default defineEventHandler(async (event) => {
  try {
    // 身份验证
    const authResult = await authenticateUser(event);
    if (!authResult.success) {
      return authResult.error;
    }
    const currentUser = authResult.user!;

    // 获取请求参数
    const { postIds, status } = await readBody(event);

    // 参数验证
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return useErrorWrapper("", 400, false, "请选择要操作的文章");
    }

    if (!status) {
      return useErrorWrapper("", 400, false, "请指定目标状态");
    }

    // 验证状态值
    const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return useErrorWrapper("", 400, false, "无效的文章状态");
    }

    // 验证文章ID格式
    const validPostIds = postIds
      .filter((id) => {
        const numId = parseInt(id);
        return !isNaN(numId) && numId > 0;
      })
      .map((id) => parseInt(id));

    if (validPostIds.length === 0) {
      return useErrorWrapper("", 400, false, "没有有效的文章ID");
    }

    // 检查权限 - 只能操作自己的文章
    const ownedPosts = await prisma.post.findMany({
      where: {
        id: { in: validPostIds },
        authorId: currentUser.userId,
      },
      select: { id: true, title: true, status: true },
    });

    if (ownedPosts.length === 0) {
      return useErrorWrapper("", 403, false, "没有权限操作这些文章");
    }

    if (ownedPosts.length !== validPostIds.length) {
      return useErrorWrapper("", 403, false, "部分文章无权限操作");
    }

    // 构建更新数据
    const updateData: any = { status };

    // 如果是发布状态，需要设置发布时间
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    // 批量更新文章状态
    const result = await prisma.post.updateMany({
      where: {
        id: { in: validPostIds },
        authorId: currentUser.userId,
      },
      data: updateData,
    });

    // 获取更新后的文章信息
    const updatedPosts = await prisma.post.findMany({
      where: { id: { in: validPostIds } },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    console.log(
      `用户 ${currentUser.userName} 批量更新了 ${result.count} 篇文章状态为 ${status}`,
    );

    return useResponseWrapper(
      {
        updatedCount: result.count,
        updatedPosts: updatedPosts,
        targetStatus: status,
      },
      200,
      true,
      `成功更新 ${result.count} 篇文章状态`,
    );
  } catch (error: any) {
    return useErrorWrapper(error, 500, false, "批量更新文章状态失败");
  }
});
