import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 删除标签接口
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
    if (!id) {
      return createErrorResponse("标签ID是必填字段", 400, false);
    }

    // 验证ID格式
    const tagId = parseInt(id);
    if (isNaN(tagId) || tagId <= 0) {
      return createErrorResponse("无效的标签ID", 400, false);
    }

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { id: true, name: true },
    });

    if (!existingTag) {
      return createErrorResponse("标签不存在", 404, false);
    }

    // 检查标签是否被文章使用
    const postCount = await prisma.postTag.count({
      where: { tagId: tagId },
    });

    if (postCount > 0) {
      return createErrorResponse(
        `该标签下还有 ${postCount} 篇文章，无法删除。请先移除相关文章或将文章移动到其他标签。`,
        400,
        false,
      );
    }

    // 删除标签
    await prisma.tag.delete({
      where: { id: tagId },
    });

    console.log(
      `用户 ${currentUser.userName} 删除了标签: ${existingTag.name} (ID: ${tagId})`,
    );

    return createSuccessResponse(
      { deletedId: tagId, deletedName: existingTag.name },
      "标签删除成功",
      200,
    );
  } catch (error: any) {
    // 处理记录不存在错误
    if (error.code === "P2025") {
      return createErrorResponse("标签不存在", 404, false);
    }

    return createErrorResponse("删除标签失败" + error, 500, false);
  }
});
