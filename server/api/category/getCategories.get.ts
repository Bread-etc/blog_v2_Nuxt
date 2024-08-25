import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const categories = await prisma.category.findMany();
        return useResponseWrapper(categories);
    } catch (error) {
        return useErrorWrapper(error, 500);
    }
})