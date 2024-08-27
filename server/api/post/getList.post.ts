import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 有分页的博客文章接口获取
export default defineEventHandler(async (event) => {
  const {
    page = 1,
    pageSize = 5,
    search,
    authorId,
    categoryIds,
    status,
  } = await readBody(event);

  try {
    const skip = (page - 1) * pageSize;
    const whereClause: any = {
      title: search ? { contains: search } : undefined,
      authorId: authorId ? Number(authorId) : undefined,
      status: status !== undefined ? Boolean(status) : undefined,
    };

    if (categoryIds && categoryIds.length > 0) {
      whereClause.categories = {
        some: {
          id: {
            in: categoryIds.map((id: number) => Number(id)),
          },
        },
      };
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        include: {
          categories: true,
          author: {
            select: { userName: true, nickName: true },
          },
          postFiles: true,
        },
        orderBy: {
          createdTime: "desc",
        },
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    return useResponseWrapper({
      data: posts,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    return useErrorWrapper(error);
  }
});
