// 成功响应接口
interface ApiSuccessResponse<T = any> {
  code: number;
  success: true;
  message: string;
  data: T;
}

// 错误响应接口
interface ApiErrorResponse {
  code: number;
  success: false;
  message: string;
  data: null;
}

// 成功响应包装器
export function createSuccessResponse<T = any>(
  data: T,
  message: string = "操作成功",
  code: number = 200,
): ApiSuccessResponse<T> {
  return {
    code,
    success: true,
    message,
    data,
  };
}

// 错误响应包装器
export function createErrorResponse(
  message: string,
  code: number = 500,
  error?: any,
): ApiErrorResponse {
  if (process.env.NODE_ENV === "development" && error) {
    console.error("API Error:", error);
  }
  return {
    code,
    success: false,
    message,
    data: null,
  };
}
