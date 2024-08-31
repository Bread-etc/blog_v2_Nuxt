import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 获取查询参数
  const { query } = await readBody(event);

  if (!query) return useErrorWrapper("Query is required", 400);

  try {
    // 根据传入的查询参数，进行搜索
    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { id: isNaN(Number(query)) ? undefined : Number(query) },
          { title: { contains: query, mode: "insensitive" } },
          {
            postFiles: {
              some: { fileName: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      },
      include: {
        postFiles: true,
        PostCategory: {
          include: {
            category: true, // 获取关联的分类信息
          },
        },
      },
    });

    if (!post) return useErrorWrapper("Post not found", 404);

    const processedPost = {
      ...post,
      categories: post.PostCategory.map((pc) => pc.category),
    };

    return useResponseWrapper(processedPost);
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
