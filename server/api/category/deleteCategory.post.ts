import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const categoryId = Number(event.context.params!.id);

    // 删除对应标签
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return useResponseWrapper("delete category successfully");
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
