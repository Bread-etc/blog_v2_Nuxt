import { prisma } from "~/server/utils/db";
import { authenticateUser } from "~/server/utils/auth";

// 批量操作标签接口
export default defineEventHandler(async (event) => {
    try {
        // 身份验证
        const authResult = await authenticateUser(event);
        if (!authResult.success) {
            return authResult.error;
        }
        const currentUser = authResult.user!;

        // 获取请求参数
        const { action, data } = await readBody(event);

        // 参数验证
        if (!action) {
            return useErrorWrapper("", 400, false, "操作类型是必填字段");
        }

        if (!['create', 'delete'].includes(action)) {
            return useErrorWrapper("", 400, false, "无效的操作类型，支持: create, delete");
        }

        if (!data || !Array.isArray(data) || data.length === 0) {
            return useErrorWrapper("", 400, false, "操作数据不能为空");
        }

        let result;

        if (action === 'create') {
            // 批量创建标签
            result = await batchCreateTags(data, currentUser);
        } else if (action === 'delete') {
            // 批量删除标签
            result = await batchDeleteTags(data, currentUser);
        }

        return result;

    } catch (error: any) {
        return useErrorWrapper(error, 500, false, "批量操作标签失败");
    }
});

// 批量创建标签
async function batchCreateTags(tags: any[], currentUser: any) {
    const validTags: { name: string; slug: string }[] = [];
    const errors: string[] = [];

    // 验证每个标签数据
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];

        if (!tag.name || !tag.name.trim()) {
            errors.push(`第${i + 1}个标签：名称不能为空`);
            continue;
        }

        // 生成slug（如果未提供）
        let tagSlug = tag.slug;
        if (!tagSlug || !tagSlug.trim()) {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 1000);
            tagSlug = `tag-${timestamp}-${randomNum}`;
        } else {
            // 验证slug格式
            const slugRegex = /^[a-zA-Z0-9-_]+$/;
            if (!slugRegex.test(tagSlug)) {
                errors.push(`第${i + 1}个标签：slug格式无效`);
                continue;
            }
            tagSlug = tagSlug.toLowerCase().trim();
        }

        validTags.push({
            name: tag.name.trim(),
            slug: tagSlug
        });
    }

    if (errors.length > 0) {
        return useErrorWrapper("", 400, false, `数据验证失败：${errors.join('; ')}`);
    }

    try {
        // 使用事务批量创建
        const createdTags = await prisma.$transaction(async (tx) => {
            const results = [];

            for (const tagData of validTags) {
                try {
                    const tag = await tx.tag.create({
                        data: tagData
                    });
                    results.push(tag);
                } catch (error: any) {
                    if (error.code === "P2002") {
                        // 跳过重复的标签，记录警告
                        console.warn(`标签 "${tagData.name}" 已存在，跳过创建`);
                    } else {
                        throw error;
                    }
                }
            }

            return results;
        });

        console.log(`用户 ${currentUser.userName} 批量创建了 ${createdTags.length} 个标签`);

        return useResponseWrapper({
            createdCount: createdTags.length,
            createdTags: createdTags,
            totalRequested: validTags.length
        }, 200, true, `成功创建 ${createdTags.length} 个标签`);

    } catch (error: any) {
        return useErrorWrapper(error, 500, false, "批量创建标签失败");
    }
}

// 批量删除标签
async function batchDeleteTags(tagIds: any[], currentUser: any) {
    // 验证ID格式
    const validTagIds = tagIds.filter(id => {
        const numId = parseInt(String(id));
        return !isNaN(numId) && numId > 0;
    }).map(id => parseInt(String(id)));

    if (validTagIds.length === 0) {
        return useErrorWrapper("", 400, false, "没有有效的标签ID");
    }

    try {
        // 检查哪些标签正在被使用
        const tagsInUse = await prisma.postTag.findMany({
            where: { tagId: { in: validTagIds } },
            select: { tagId: true },
            distinct: ['tagId']
        });

        const usedTagIds = tagsInUse.map(pt => pt.tagId);
        const canDeleteIds = validTagIds.filter(id => !usedTagIds.includes(id));

        if (canDeleteIds.length === 0) {
            return useErrorWrapper("", 400, false, "所选标签都正在被文章使用，无法删除");
        }

        // 获取要删除的标签信息（用于日志）
        const tagsToDelete = await prisma.tag.findMany({
            where: { id: { in: canDeleteIds } },
            select: { id: true, name: true }
        });

        // 批量删除标签
        const deleteResult = await prisma.tag.deleteMany({
            where: { id: { in: canDeleteIds } }
        });

        console.log(`用户 ${currentUser.userName} 批量删除了 ${deleteResult.count} 个标签`);

        return useResponseWrapper({
            deletedCount: deleteResult.count,
            deletedTags: tagsToDelete,
            skippedCount: usedTagIds.length,
            totalRequested: validTagIds.length
        }, 200, true, `成功删除 ${deleteResult.count} 个标签${usedTagIds.length > 0 ? `，跳过 ${usedTagIds.length} 个正在使用的标签` : ''}`);

    } catch (error: any) {
        return useErrorWrapper(error, 500, false, "批量删除标签失败");
    }
}