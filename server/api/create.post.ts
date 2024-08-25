import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 上传路径
  const uploadDir = path.join(process.cwd(), "uploads");
  // 如果文件夹不存在, 则创建文件夹
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 表单配置项
  const form = formidable({
    uploadDir,
    keepExtensions: true, // 保留扩展名
    maxFileSize: 5 * 1024 * 1024, // 文件最大50M
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
    const authorId = Array.isArray(fields.authorId)
      ? Number(fields.authorId[0])
      : Number(fields.authorId);
    const selectedCategories = Array.isArray(fields.selectedCategories)
      ? fields.selectedCategories.map((categoryId: string) => ({
          id: Number(categoryId),
        }))
      : [];

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = file!.filepath;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(authorId),
        categories: {
          connect: selectedCategories,
        },
        postFiles: {
          create: {
            fileName: file!.originalFilename || file!.newFilename,
            fileAddress: filePath,
          },
        },
      },
    });

    return { success: true, post: newPost };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "File upload or datebase insertion failed",
    });
  }
});
