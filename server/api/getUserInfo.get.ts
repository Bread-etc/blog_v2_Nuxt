import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany();
    return {
      success: true,
      message: "success",
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
});
