import { privateKey } from "./getPublicKey.get";
import { CryptoUtils } from "../../utils/crypto";
import { prisma } from "../../utils/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body: { username: string; password: string } = await readBody(event);

    // 参数验证
    if (!body.username || !body.password) {
      return useErrorWrapper("", 400, false, "用户名和密码是必填字段");
    }

    // RSA解密用户名和密码
    let username: string;
    let password: string;

    try {
      username = CryptoUtils.decrypt(body.username, privateKey);
      password = CryptoUtils.decrypt(body.password, privateKey);
    } catch (error: any) {
      return useErrorWrapper("", 400, false, "解密失败，请检查数据格式");
    }

    // 验证解密后的数据
    if (!username.trim() || !password.trim()) {
      return useErrorWrapper("", 400, false, "用户名和密码不能为空");
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
      return useErrorWrapper("", 401, false, "用户名或密码错误");
    }

    // 验证密码
    if (user.password !== password) {
      return useErrorWrapper("", 401, false, "用户名或密码错误");
    }

    // 生成 JWT Token
    const tokenPayload = {
      userId: user.id,
      userName: user.userName,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "24h",
    });

    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      userName: user.userName,
      nickName: user.nickName,
      createdTime: user.createdTime,
      token: token,
    };

    return useResponseWrapper(userInfo, 200, true, "登录成功");
  } catch (error: any) {
    console.error("登录错误:", error);
    return useErrorWrapper(error, 500, false, "登录失败，请稍后重试");
  }
});
