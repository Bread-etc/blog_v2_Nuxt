import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// JWT 载荷接口
interface JwtPayload {
  userId: number;
  userName: string;
  iat?: number; // Token 签发时间戳
  exp?: number; // Token 过期时间戳
}

// Token 验证结果
interface TokenVerifyResult {
  success: boolean;
  payload?: JwtPayload;
  error?: string;
}

export function verifyToken(token: string): TokenVerifyResult {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return {
      success: true,
      payload: decoded,
    };
  } catch (error: any) {
    let errorMessage = "Token 验证失败";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token 已过期";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Token 格式无效";
    } else if (error.name === "NotBeforeError") {
      errorMessage = "Token 尚未生效";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
