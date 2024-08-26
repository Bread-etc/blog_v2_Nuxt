import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
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
