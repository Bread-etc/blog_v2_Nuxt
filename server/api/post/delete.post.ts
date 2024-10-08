import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 从请求头中获取 Authorization
  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    return useErrorWrapper("", 401, false, "Authorization header missing");
  }
  const token = authHeader.split(" ")[1];
  verifyToken(token);

  const { postId } = await readBody(event);

  try {
    await prisma.$transaction(async () => {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { postFiles: true }, // 获取与文章相关的文件信息
      });

      if (!post) {
        throw new Error("文章不存在");
      }

      // 删除文件系统中的对应文件
      post.postFiles.forEach((file: any) => {
        try {
          fs.unlinkSync(file.fileAddress);
        } catch (error) {
          console.error(`删除文件失败: ${file.fileAddress}`, error);
        }
      });

      // 删除 post_file 表内对应记录
      await prisma.postFile.deleteMany({
        where: { id: postId },
      });

      // 删除 post_category 表中的相关记录
      await prisma.postCategory.deleteMany({
        where: { postId: postId },
      });

      // 删除 post 表中的记录
      await prisma.post.delete({
        where: { id: postId },
      });
    });

    return useResponseWrapper("delete Post successfully");
  } catch (error) {
    console.error("Error delete post", error);
    return useErrorWrapper(error, 500, false, "Failed to delete post");
  } finally {
    await prisma.$disconnect();
  }
});
