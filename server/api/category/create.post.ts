import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const { name, color, icon } = await readBody(event);
        await prisma.category.create({
            data: {
                name,
                color,
                icon
            }
        });

        return useResponseWrapper("add category successfully");
    } catch (error) {
        return useErrorWrapper(error, 500);
    }
});
