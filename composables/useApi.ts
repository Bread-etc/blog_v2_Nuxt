import { toast } from "vue-sonner";
import type { ApiResponse } from "~/types";

// 针对 $fetch 进行封装

interface ApiOptions extends RequestInit {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  loading?: Ref<boolean>;
}

export const useApi = () => {
  const config = useRuntimeConfig();

  const request = async <T = any>(
    url: string,
    options: ApiOptions = {},
  ): Promise<ApiResponse<T>> => {
    const {
      showErrorToast = true,
      showSuccessToast = false,
      successMessage = "操作成功",
      loading,
      ...fetchOptions
    } = options;

    if (loading) loading.value = true;

    try {
      const response = await $fetch<ApiResponse<T>>(url, {
        baseURL: config.public.apiBase || "/api",
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      // 成功提示
      if (showSuccessToast && response.code === 200) {
        toast.success(successMessage);
      }

      return response;
    } catch (error: any) {
      // 错误处理
      const errorMessage = error?.data?.message || error?.message || "请求失败";

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      throw error;
    } finally {
      if (loading) loading.value = false;
    }
  };

  // GET
  const get = <T = any>(
    url: string,
    options: Omit<ApiOptions, "method"> = {},
  ) => {
    return request<T>(url, { ...options, method: "GET" });
  };

  // POST
  const post = <T = any>(
    url: string,
    body?: any,
    options: Omit<ApiOptions, "method" | "body"> = {},
  ) => {
    return request<T>(url, { ...options, method: "POST", body });
  };

  // PUT
  const put = <T = any>(
    url: string,
    body?: any,
    options: Omit<ApiOptions, "method" | "body"> = {},
  ) => {
    return request<T>(url, { ...options, method: "PUT", body });
  };

  // DELETE
  const del = <T = any>(
    url: string,
    options: Omit<ApiOptions, "method"> = {},
  ) => {
    return request<T>(url, { ...options, method: "DELETE" });
  };

  return {
    request,
    get,
    post,
    put,
    delete: del,
  };
};
