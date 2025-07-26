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

    // 获取请求参数
    const { id, name, slug, description, color, sortOrder } =
      await readBody(event);

    // 参数验证
    if (!id) {
      return useErrorWrapper("", 400, false, "分类ID是必填字段");
    }

    // 验证ID格式
    const categoryId = parseInt(id);
    if (isNaN(categoryId) || categoryId <= 0) {
      return useErrorWrapper("", 400, false, "无效的分类ID");
    }

    // 构建更新数据对象
    const updateData: any = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return useErrorWrapper("", 400, false, "分类名称不能为空");
      }
      updateData.name = name.trim();
    }

    if (slug !== undefined) {
      if (!slug.trim()) {
        return useErrorWrapper("", 400, false, "分类slug不能为空");
      }
      // 验证slug格式
      const slugRegex = /^[a-zA-Z0-9-_]+$/;
      if (!slugRegex.test(slug)) {
        return useErrorWrapper(
          "",
          400,
          false,
          "slug只能包含字母、数字、连字符和下划线",
        );
      }
      updateData.slug = slug.toLowerCase().trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (color !== undefined) {
      const validColors = [
        "BLUE",
        "GREEN",
        "RED",
        "PURPLE",
        "ORANGE",
        "YELLOW",
        "PINK",
        "GRAY",
      ];
      if (color && !validColors.includes(color)) {
        return useErrorWrapper("", 400, false, "无效的颜色值");
      }
      updateData.color = color || "BLUE";
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = sortOrder || 0;
    }

    // 检查是否有字段需要更新
    if (Object.keys(updateData).length === 0) {
      return useErrorWrapper("", 400, false, "至少需要提供一个要更新的字段");
    }

    // 更新分类
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    console.log(`用户 ${currentUser.userName} 更新了分类: ${category.name}`);

    return useResponseWrapper(category, 200, true, "分类更新成功");
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2025") {
      return useErrorWrapper("", 404, false, "分类不存在");
    }

    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target?.includes("name")) {
        return useErrorWrapper("", 400, false, "分类名称已存在");
      } else if (target?.includes("slug")) {
        return useErrorWrapper("", 400, false, "分类slug已存在");
      } else {
        return useErrorWrapper("", 400, false, "分类名称或slug已存在");
      }
    }

    return useErrorWrapper(error, 500, false, "更新分类失败");
  }
});
