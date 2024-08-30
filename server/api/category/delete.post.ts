import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // 从请求头中获取 Authorization
    const authHeader = getHeader(event, "authorization");
    if (!authHeader) {
      return useErrorWrapper("", 401, false, "Authorization header missing");
    }
    const token = authHeader.split(" ")[1];
    verifyToken(token);

    const { id } = await readBody(event);
    // 删除对应标签
    await prisma.category.delete({
      where: { id: id },
    });

    return useResponseWrapper("delete category successfully");
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
