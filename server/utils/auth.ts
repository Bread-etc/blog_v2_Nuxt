import type { H3Event } from "h3";

// 身份验证结果接口
interface AuthResult {
  success: boolean;
  user?: {
    userId: number;
    userName: string;
  };
  error?: any;
}

/**
 * 验证用户身份
 * @param event H3Event 对象
 * @returns 验证结果
 */
export async function authenticateUser(event: H3Event): Promise<AuthResult> {
  try {
    // 获取Authorization
    const authHeader = getHeader(event, "authorization");
    if (!authHeader) {
      return {
        success: false,
        error: createErrorResponse("需要登录权限", 401, false),
      };
    }

    // 提取token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        success: false,
        error: createErrorResponse("Token格式错误", 401, false),
      };
    }

    // 验证token
    const verifyResult = verifyToken(token);
    if (!verifyResult.success) {
      return {
        success: false,
        error: createErrorResponse(
          verifyResult.error || "Token验证失败",
          401,
          false,
        ),
      };
    }

    // 返回用户信息
    return {
      success: true,
      user: verifyResult.payload!,
    };
  } catch (error: any) {
    return {
      success: false,
      error: createErrorResponse("身份验证失败:" + error, 500, false),
    };
  }
}
