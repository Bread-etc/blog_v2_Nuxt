import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 创建标签接口
export default defineEventHandler(async (event) => {
  try {
    // 身份验证
    const authResult = await authenticateUser(event);
    if (!authResult.success) {
      return authResult.error;
    }
    const currentUser = authResult.user!;

    // 获取请求参数
    const { name, slug } = await readBody(event);
    if (!name || !name.trim()) {
      return createErrorResponse("标签名称是必填字段", 400, false);
    }

    // 生成slug（如果未提供）
    let tagSlug = slug;
    if (!tagSlug || !tagSlug.trim()) {
      // 使用时间戳生成slug
      const timestamp = Date.now();
      tagSlug = `tag-${timestamp}`;
    } else {
      // 验证slug格式
      const slugRegex = /^[a-zA-Z0-9-_]+$/;
      if (!slugRegex.test(tagSlug)) {
        return createErrorResponse(
          "slug只能包含字母、数字、连字符和下划线",
          400,
          false,
        );
      }
      tagSlug = tagSlug.toLowerCase().trim();
    }

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug: tagSlug,
      },
    });

    console.log(`用户 ${currentUser.userName} 创建了标签: ${tag.name}`);

    return createSuccessResponse(tag, "标签创建成功", 200);
  } catch (error: any) {
    // 处理唯一约束错误
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

    return createErrorResponse("创建标签失败" + error, 500, false);
  }
});
