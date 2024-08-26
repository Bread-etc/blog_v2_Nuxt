import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
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
