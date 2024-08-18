import { PrismaClient } from "@prisma/client";
import { privateKey } from "../secret/getPublicKey.get";
import { decryptContent } from "../../utils/decryptContent";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
  try {
    const body: { username: string; password: string } = await readBody(event);
    const username = decryptContent(body.username, privateKey);
    const password = decryptContent(body.password, privateKey);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: {
        userName: username,
      },
    });

    if (!user) {
      return useErrorWrapper("", 404, false, "User not found");
    }

    // 验证密码
    if (user.password !== password) {
      return useErrorWrapper("", 401, false, "Incorrect password");
    }

    // 检查用户角色
    if (user.role !== "admin") {
      return useErrorWrapper("", 403, false, "Unauthorized");
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, username: user.userName, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // 返回不含密码,包含token的用户信息
    const userInfo = {
      id: user.id,
      userName: user.userName,
      role: user.role,
      nickName: user.nickName,
      createdTime: user.createdTime,
      token: token,
    };

    return useResponseWrapper(userInfo, 200, true, "Login successful");
  } catch (error) {
    console.log(error);
    return useErrorWrapper("", 500, false, "Internal server error");
  }
});
