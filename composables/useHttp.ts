/**
 * 对$fetch进行封装 [https://github.com/LUDA0831/nuxt3-template-demo/blob/main/composables/useHttp.ts]
 * 1. 简化http请求
 * 2. 支持服务端渲染(ssr)
 * 3. 避免重复数据获取
 */
import { useUserStore } from "~/stores/user.store";
import { navigateTo, useRuntimeConfig } from "nuxt/app";
import type { FetchResponse, SearchParameters } from "ofetch";
import { usePVToastService } from "./useToastService";

export interface ResOptions<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

const toastService = usePVToastService();

// 处理错误
function handelError<T>(
  response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>,
) {
  const err = (text: string) => {
    toastService.add({
      severity: "error",
      summary: "Error 😢",
      detail: response?._data?.message ?? text,
      life: 3000,
    });
  };

  if (!response._data) {
    err("请求超时，服务器无响应！");
    return;
  }

  const userStore = useUserStore();
  const handleMap: { [key: number]: () => void } = {
    404: () => err("服务器资源不存在"),
    500: () => err("服务器内部错误"),
    403: () => err("没有权限访问该资源"),
    401: () => {
      err("token已过期，需要重新登录");
      userStore.clearUserInfo();
      navigateTo("/admin/login");
    },
  };
  handleMap[response.status] ? handleMap[response.status]() : err("未知错误！");
}

// get 方法传递数组形式参数
function paramsSerializer(params?: SearchParameters) {
  if (!params) return;

  const query = useCloneDeep(params);
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === "object" && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v) => JSON.stringify(v));
      delete query[key];
    }
  });
  return query;
}

const fetch = $fetch.create({
  // 请求拦截器
  onRequest({ options }) {
    // get方法传递数组形式参数
    options.params = paramsSerializer(options.params);
    // 添加baseUrl
    const config = useRuntimeConfig();
    options.baseURL = config.public.apiBase;
    // 添加请求头
    const userStore = useUserStore();
    if (userStore.isLogin) {
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${userStore.getToken}`);
    }
  },
  // 响应拦截器
  onResponse({ response }) {
    if (
      response.headers.get("content-disposition") &&
      response.status === 200
    ) {
      return response;
    }
    if (response._data.code !== 200) {
      handelError(response);
      return Promise.reject(response._data);
    }
    // 成功回调
    return response._data;
  },
  // 错误处理
  onResponseError({ response }) {
    handelError(response);
    return Promise.reject(response?._data ?? null);
  },
});

export const useHttp = {
  get: <T>(url: string, params?: any) => {
    return fetch<ResOptions<T>>(url, { method: "get", params });
  },

  post: <T>(url: string, body?: any) => {
    return fetch<ResOptions<T>>(url, { method: "post", body });
  },

  put: <T>(url: string, body?: any) => {
    return fetch<ResOptions<T>>(url, { method: "put", body });
  },

  delete: <T>(url: string, body?: any) => {
    return fetch<ResOptions<T>>(url, { method: "delete", body });
  },
};
