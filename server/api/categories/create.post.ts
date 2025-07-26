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
    const { name, slug, description, color, sortOrder } = await readBody(event);
    // 参数验证
    if (!name || !slug) {
      return useErrorWrapper("", 400, false, "分类名称和slug是必填字段");
    }
    // 验证slug格式（只允许字母、数字、连字符、下划线）
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(slug)) {
      return useErrorWrapper(
        "",
        400,
        false,
        "slug只能包含字母、数字、连字符和下划线",
      );
    }

    // 验证颜色值
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
    const categoryColor = color && validColors.includes(color) ? color : "BLUE";

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description?.trim() || null,
        color: categoryColor,
        sortOrder: sortOrder || 0,
      },
    });

    return useResponseWrapper(category, 200, true, "分类创建成功");
  } catch (error: any) {
    // 处理Prisma错误
    if (error.code === "P2002") {
      // 唯一约束冲突
      const target = error.meta?.target;
      if (target?.includes("name")) {
        return useErrorWrapper("", 400, false, "分类名称已存在");
      } else if (target?.includes("slug")) {
        return useErrorWrapper("", 400, false, "分类slug已存在");
      } else {
        return useErrorWrapper("", 400, false, "分类名称或slug已存在");
      }
    }

    return useErrorWrapper(error, 500, false, "创建分类失败");
  }
});
