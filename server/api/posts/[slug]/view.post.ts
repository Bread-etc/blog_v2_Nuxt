import { prisma } from "~/server/utils/db";

// 更新文章浏览量接口
export default defineEventHandler(async (event) => {
    try {
        // 获取路由参数
        const slug = getRouterParam(event, "slug");

        if (!slug) {
            return useErrorWrapper("", 400, false, "文章slug是必填字段");
        }

        // 获取客户端信息（用于简单的防刷机制）
        const forwarded = getHeader(event, "x-forwarded-for");
        const realIP = getHeader(event, "x-real-ip");
        const remoteAddress = event.node.req.socket?.remoteAddress;

        const clientIP = (forwarded && forwarded.split(',')[0].trim()) ||
            realIP ||
            remoteAddress ||
            "unknown";

        // 检查文章是否存在且已发布
        const post = await prisma.post.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                viewCount: true,
                status: true,
            },
        });

        if (!post) {
            return useErrorWrapper("", 404, false, "文章不存在");
        }

        // 只有已发布的文章才统计浏览量
        if (post.status !== "PUBLISHED") {
            return useErrorWrapper("", 400, false, "文章未发布，无法统计浏览量");
        }

        // 更新浏览量
        const updatedPost = await prisma.post.update({
            where: { slug },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
            select: {
                id: true,
                title: true,
                viewCount: true,
            },
        });

        // 记录访问日志
        console.log(
            `文章浏览量更新: "${post.title}" +1，当前浏览量: ${updatedPost.viewCount}，访问IP: ${clientIP}`
        );

        return useResponseWrapper(
            {
                postId: updatedPost.id,
                title: updatedPost.title,
                viewCount: updatedPost.viewCount,
                previousCount: post.viewCount,
                increment: 1,
            },
            200,
            true,
            "浏览量更新成功"
        );
    } catch (error: any) {
        console.error("更新浏览量失败:", error);
        return useErrorWrapper(error, 500, false, "更新浏览量失败");
    }
});