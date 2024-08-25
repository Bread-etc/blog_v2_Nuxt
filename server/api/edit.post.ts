import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 获取 postId
  const { postId } = event.context.params || {};

  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing postId",
    });
  }

  // 上传路径
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 表单配置项
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    filename: (name, ext, part) => {
      return `${part.originalFilename}`;
    },
  });

  const { fields, files } = await new Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
  }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  try {
    const title = (
      Array.isArray(fields.title) ? fields.title[0] : fields.title
    ) as string;
    const content = Array.isArray(fields.content)
      ? fields.content[0]
      : fields.content;
    const selectedCategories = Array.isArray(fields.selectedCategories)
      ? fields.selectedCategories.map((categoryId: string) => ({
          id: Number(categoryId),
        }))
      : [];

    // 查找当前文章
    const existingPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { postFiles: true },
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    let fileData = {};
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (file) {
      const filePath = file!.filepath;

      // 删除旧文件
      if (existingPost.postFiles.length > 0) {
        const oldFilePath = existingPost.postFiles[0].fileAddress;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      fileData = {
        postFiles: {
          upsert: {
            where: { id: existingPost.postFiles[0]?.id || 0 },
            update: {
              fileName: file!.originalFilename || file!.newFilename,
              fileAddress: filePath,
            },
            create: {
              fileName: file!.originalFilename || file!.newFilename,
              fileAddress: filePath,
            },
          },
        },
      };
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        title,
        content,
        categories: {
          set: selectedCategories, // 清除旧的分类关联并设置新的
        },
        ...fileData,
      },
    });

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update post",
    });
  }
});
