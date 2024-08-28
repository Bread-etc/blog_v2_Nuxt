import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 获取查询id
  const { id } = await readBody(event);

  if (isNaN(id)) return useErrorWrapper("Invalid post id", 404);

  try {
    // 开始事务
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true, // 查询文章关联的分类
        postFiles: true, // 查询文章关联的文件
      },
    });

    if (!post) return useErrorWrapper("Post not found", 404);

    return useResponseWrapper(post);
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
