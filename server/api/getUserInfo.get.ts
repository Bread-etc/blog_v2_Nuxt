import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany();
    return useResponseWrapper(users);
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
