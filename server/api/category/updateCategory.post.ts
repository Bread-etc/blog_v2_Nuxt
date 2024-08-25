import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const categoryId = Number(event.context.params!.id);
        const { name, color, icon } = await readBody(event);

        await prisma.category.update({
            where: { id: categoryId },
            data: {
                name,
                color,
                icon,
            }
        });

        return useResponseWrapper("update category successfully");
    } catch (error) {
        return useErrorWrapper(error, 500);
    }
})