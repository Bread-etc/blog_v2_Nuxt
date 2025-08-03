import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

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
      return createErrorResponse("分类ID是必填字段", 400, false);
    }

    // 验证ID格式
    const categoryId = parseInt(id);
    if (isNaN(categoryId) || categoryId <= 0) {
      return createErrorResponse("无效的分类ID", 400, false);
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true },
    });

    if (!existingCategory) {
      return createErrorResponse("分类不存在", 404, false);
    }

    // 安全检查
    const postCount = await prisma.postCategory.count({
      where: { categoryId: categoryId },
    });

    if (postCount > 0) {
      return createErrorResponse(
        `该分类下还有 ${postCount} 篇文章，无法删除。请先移除相关文章或将文章移动到其他分类。`,
        400,
        false,
      );
    }

    // 删除操作
    await prisma.category.delete({
      where: { id: categoryId },
    });

    console.log(
      `用户 ${currentUser.userName} 删除了分类: ${existingCategory.name} (ID: ${categoryId})`,
    );

    return createSuccessResponse(
      { deletedId: categoryId, deletedName: existingCategory.name },
      "分类删除成功",
      200,
    );
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2025") {
      return createErrorResponse("分类不存在", 404, false);
    }

    return createErrorResponse("删除分类失败:" + error, 500, false);
  }
});
