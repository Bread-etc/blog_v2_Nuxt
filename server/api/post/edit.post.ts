import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // 从请求头中获取 Authorization
  const authHeader = getHeader(event, "authorization");
  if (!authHeader) {
    return useErrorWrapper("", 401, false, "Authorization header missing");
  }
  const token = authHeader.split(" ")[1];
  verifyToken(token);

  // 获取 postId
  const uploadDir = path.join(process.cwd(), "uploads");

  // 创建上传文件夹（如果不存在）
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 表单配置项
  const form = formidable({
    uploadDir,
    keepExtensions: true, // 保留文件扩展名
    maxFileSize: 5 * 1024 * 1024, // 文件最大限制 50M
    filename: (name, ext, part) => `${part.originalFilename}`, // 使用原始文件名
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
    const postId = Number(fields.postId![0]);
    const title = fields.title![0];
    const content = fields.content![0];
    const selectedTags = fields.tags![0].split(",").map((item) => Number(item));
    const status = fields.status![0] === "false" ? false : true;

    const file = files.file ? files.file[0] : null;
    const newFilePath = file ? file.filepath : null;

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postFiles: true,
        PostCategory: true,
      },
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    // 如果上传了文件
    if (file) {
      const existingFile = existingPost.postFiles[0];

      // 检查文件名是否相同
      if (existingFile && existingFile.fileName !== file.originalFilename) {
        fs.unlinkSync(existingFile.fileAddress);
      }

      // 更新文章文件信息
      await prisma.postFile.update({
        where: { id: existingPost.id },
        data: {
          fileName: file?.originalFilename!,
          fileAddress: newFilePath!,
        },
      });
    }

    // 更新文章信息
    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        status,
        PostCategory: {
          deleteMany: {},
          create: selectedTags.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });

    return useResponseWrapper("Post updated successfully");
  } catch (error) {
    console.error(error);
    return useErrorWrapper(error, 500, false, "Failed to update post");
  }
});
