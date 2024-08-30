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

    const { id, name, color, icon } = await readBody(event);
    await prisma.category.update({
      where: { id: id },
      data: {
        name,
        color,
        icon,
      },
    });

    return useResponseWrapper("update category successfully");
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
