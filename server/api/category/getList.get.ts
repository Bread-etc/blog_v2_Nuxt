import prisma from "~/lib/prisma";

export default defineEventHandler(async (_event) => {
    try {
        const categories = await prisma.category.findMany();
        return useResponseWrapper(categories);
    } catch (error) {
        return useErrorWrapper(error, 500);
    }
})