import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 获取查询参数
  const { query } = await readBody(event);

  if (!query || query.trim() === "")
    return useErrorWrapper("Query is required", 400);

  try {
    // 根据传入的查询参数，进行搜索
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          // 模糊匹配
          { title: { contains: query } },
          {
            postFiles: {
              some: { fileName: { contains: query } },
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

    if (posts.length === 0) return useErrorWrapper("Post not found", 404);

    // 处理每个文章的分类信息
    const processedPosts = posts.map((post: any) => ({
      ...post,
      categories: post.PostCategory.map((pc: any) => pc.category),
    }));

    return useResponseWrapper(processedPosts);
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
