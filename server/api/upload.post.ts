import { IncomingMessage, ServerResponse } from "http";
import formidable from "formidable";
import { mkdirSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { eventHandler, fromNodeMiddleware } from "h3";

const prisma = new PrismaClient();

export default eventHandler(
  fromNodeMiddleware(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const uploadDir = path.join(process.cwd(), "uploads");
      mkdirSync(uploadDir, { recursive: true });

      const form = formidable({
        uploadDir,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("File upload error:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "File upload failed" }));
          return;
        }

        // 假设文件字段名为 'file'
        const file = files.file as unknown as formidable.File;

        if (!file) {
          console.error("No file uploaded or wrong field name");
          res.statusCode = 400;
          res.end(
            JSON.stringify({ error: "No file uploaded or wrong field name" }),
          );
          return;
        }

        const fileName = file.newFilename;
        const filePath = path.join(uploadDir, fileName);

        try {
          await prisma.postFile.create({
            data: {
              fileName: file.originalFilename || fileName,
              fileAddress: filePath,
              postId: Number(fields.postId),
            },
          });

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, fileName }));
        } catch (dbError) {
          console.error("Database insertion error:", dbError);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Database insertion failed" }));
        }
      });
    } catch (generalError) {
      console.error("General error:", generalError);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "An error occurred" }));
    }
  }),
);
