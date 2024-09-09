import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // 获取查询id
  const { id } = await readBody(event);

  if (isNaN(id)) return useErrorWrapper("Invalid post id", 404);

  try {
    // 开始事务
    const post = await prisma.post.findUnique({
      where: { id },
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
      categories: post.PostCategory.map((pc: any) => pc.category),
    };

    return useResponseWrapper(processedPost);
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});
