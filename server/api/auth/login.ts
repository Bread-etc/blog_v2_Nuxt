import { privateKey } from "./getPublicKey.get";
import { CryptoUtils } from "../../utils/crypto";
import { prisma } from "../../utils/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
  try {
    const body: { username: string; password: string } = await readBody(event);
    if (!body.username || !body.password) {
      return createErrorResponse("用户名和密码是必填字段", 400, false);
    }

    let username: string;
    let password: string;

    try {
      username = CryptoUtils.decrypt(body.username, privateKey);
      password = CryptoUtils.decrypt(body.password, privateKey);
    } catch (error: any) {
      return createErrorResponse("解密失败，请检查数据格式", 400, false);
    }

    // 验证解密后的数据
    if (!username.trim() || !password.trim()) {
      return createErrorResponse("用户名和密码不能为空", 400, false);
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: {
        userName: username.trim(),
      },
      select: {
        id: true,
        userName: true,
        password: true,
        nickName: true,
        createdTime: true,
        updatedTime: true,
      },
    });

    if (!user) {
      return createErrorResponse("用户名或密码错误", 401, false);
    }

    // 验证密码
    if (user.password !== password) {
      return createErrorResponse("用户名或密码错误", 401, false);
    }

    // 生成 JWT Token
    const tokenPayload = {
      userId: user.id,
      userName: user.userName,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "24h",
    });

    // 返回用户信息
    const userInfo = {
      id: user.id,
      userName: user.userName,
      nickName: user.nickName,
      createdTime: user.createdTime,
      token: token,
    };

    return createSuccessResponse(userInfo, "登录成功", 200);
  } catch (error: any) {
    console.error("登录错误:", error);
    return createErrorResponse("登录失败，请稍后重试:" + error, 500);
  }
});
