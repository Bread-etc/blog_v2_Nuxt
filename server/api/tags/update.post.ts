import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 更新标签接口
export default defineEventHandler(async (event) => {
  try {
    // 身份验证
    const authResult = await authenticateUser(event);
    if (!authResult.success) {
      return authResult.error;
    }
    const currentUser = authResult.user!;

    const { id, name, slug } = await readBody(event);
    if (!id) {
      return createErrorResponse("标签ID是必填字段", 400, false);
    }

    // 验证ID格式
    const tagId = parseInt(id);
    if (isNaN(tagId) || tagId <= 0) {
      return createErrorResponse("无效的标签ID", 400, false);
    }

    // 构建更新数据对象（只更新提供的字段）
    const updateData: any = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return createErrorResponse("标签名称不能为空", 400, false);
      }
      updateData.name = name.trim();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return createErrorResponse("标签slug不能为空", 400, false);
      }
      // 验证slug格式
      const slugRegex = /^[a-zA-Z0-9-_]+$/;
      if (!slugRegex.test(slug)) {
        return createErrorResponse(
          "slug只能包含字母、数字、连字符和下划线",
          400,
          false,
        );
      }
      updateData.slug = slug.toLowerCase().trim();
    }

    // 检查是否有字段需要更新
    if (Object.keys(updateData).length === 0) {
      return createErrorResponse("至少需要提供一个要更新的字段", 400, false);
    }

    // 更新标签
    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: updateData,
    });

    console.log(`用户 ${currentUser.userName} 更新了标签: ${tag.name}`);

    return createSuccessResponse(tag, "标签更新成功", 200);
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2025") {
      return createErrorResponse("标签不存在", 404, false);
    }

    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target?.includes("name")) {
        return createErrorResponse("标签名称已存在", 400, false);
      } else if (target?.includes("slug")) {
        return createErrorResponse("标签slug已存在", 400, false);
      } else {
        return createErrorResponse("标签名称或slug已存在", 400, false);
      }
    }

    return createErrorResponse("更新标签失败:" + error, 500, false);
  }
});
