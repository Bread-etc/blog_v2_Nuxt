/**
 * 用户包装API相应的辅助函数
 */

export function useResponseWrapper(
  data: any,
  code: number = 200,
  success: boolean = true,
  message: string = "success",
) {
  return {
    code,
    success,
    message,
    data,
  };
}

export function useErrorWrapper(
  error: any,
  code: number = -1,
  success: boolean = false,
  message: string = error,
) {
  return {
    code,
    success,
    message: error instanceof Error ? error.message : message,
  };
}
