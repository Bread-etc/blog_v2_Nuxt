import { prisma } from "~/server/utils/db";

// 获取标签列表接口
export default defineEventHandler(async (event) => {
    try {
        // 获取查询参数
        const query = getQuery(event);
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 20;
        const includePostCount = query.includePostCount === 'true';
        const skip = (page - 1) * limit;

        // 查询标签列表
        const [tags, total] = await Promise.all([
            prisma.tag.findMany({
                orderBy: [
                    { name: 'asc' } // 按名称升序排列
                ],
                skip,
                take: limit,
                include: includePostCount ? {
                    posts: {
                        select: { postId: true }
                    }
                } : undefined
            }),
            prisma.tag.count()
        ]);

        // 处理返回数据
        const result = includePostCount
            ? tags.map(tag => {
                const { posts, ...tagData } = tag as any;
                return {
                    ...tagData,
                    postCount: posts?.length || 0
                };
            })
            : tags;

        // 分页信息
        const pagination = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        };

        return useResponseWrapper({
            tags: result,
            pagination
        }, 200, true, "获取标签列表成功");

    } catch (error: any) {
        return useErrorWrapper(error, 500, false, "获取标签列表失败");
    }
});