/**
 * 对$fetch进行封装 [https://blog.csdn.net/lsjweiyi/article/details/137425718]
 * 1. 简化http请求
 * 2. 支持服务端渲染(ssr)
 * 3. 避免重复数据获取
 */

import { useToast } from 'primevue/usetoast';
import { useRuntimeConfig } from '#app';

export interface IResponse<T> {
    code: number;
    data?: T,
    headers: Headers;
}

const toast = useToast();
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase;

function fetch<T>(url: string, options?: any): Promise<IResponse<T>> {
    return $fetch<IResponse<T>>(url, {
        ...options,
        baseURL: baseUrl,
        onResponse({ response }) {
            // fetch会自动解析数据,进入onResponse前就已经解析过了,如果解析失败,解析的结果就是response._data
            let contentType = response.headers.get("content-type");

            // code !== 200 的情况
            if (!response.ok) {
                response._data = { code: -1, data: "request has arrived but not responded:" + response.statusText, headers: response.headers }
                toast.add({ severity: "error", summary: `error: ${response.statusText}`});
                return;
            }

            // json 和 blob 两种类型
            if (!contentType) {
                response._data = { code: -1, data: "response's content-type error"};
                
            }
        }
    })
}