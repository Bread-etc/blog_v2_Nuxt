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

  // 解析请求中的表单数据 (字段 + 文件)
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
    const title = fields.title![0];
    const content = fields.content![0];
    const authorId = Number(fields.authorId![0]);
    const selectedTags = fields.tags![0].split(",").map((item) => Number(item));
    const status = fields.status![0] === "false" ? false : true;

    // 创建时 file 一定存在
    const file = files.file![0];
    const filePath = file.filepath;

    // 开启事务时, 确保操作的一致性
    await prisma.$transaction(async (prisma) => {
      // 创建新文章记录
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
          status,
        },
      });

      // 创建与文章相关联的文件记录
      await prisma.postFile.create({
        data: {
          fileName: file.originalFilename || file.newFilename,
          fileAddress: filePath,
          postId: post.id,
        },
      });

      // 创建文章与标签的关联关系
      await prisma.postCategory.createMany({
        data: selectedTags.map((categoryId) => ({
          postId: post.id,
          categoryId,
        })),
      });
    });

    // 返回成功响应和新创建的文章记录
    return useResponseWrapper("create article successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    return useErrorWrapper(
      error,
      500,
      false,
      "File upload or datebase insertion failed",
    );
  }
});
