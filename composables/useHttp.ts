import { useUserStore } from './../stores/user.store';
/**
 * 对$fetch进行封装 [https://github.com/LUDA0831/nuxt3-template-demo/blob/main/composables/useHttp.ts]
 * 1. 简化http请求
 * 2. 支持服务端渲染(ssr)
 * 3. 避免重复数据获取
 */
import showToast from "../utils/toastService";
import { navigateTo, useRuntimeConfig } from "nuxt/app";
import type { FetchResponse, SearchParameters } from 'ofetch'

export interface ResOptions<T> {
    code: number;
    data: T;
    message: string;
    success: boolean;
}

const config = useRuntimeConfig();
const baseUrl = config.public.baseUrl as string;


// 处理错误
function handelError<T>(response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>) {
    const err = (text: string) => {
        showToast("error", "Error", response?._data?.message ?? text);
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
            navigateTo('/login');
        },
    }
    handleMap[response.status] ? handleMap[response.status](): err("未知错误！");
}

// get 方法传递数组形式参数
function paramsSerializer(params?: SearchParameters) {
    if (!params) return;

    const query = useCloneDeep(params);
    Object.entries(query).forEach(([key, val]) => {
        
    })
}

// // HttpService请求类
// export class HttpService {
//     private baseUrl: string;

//     constructor() {
//         const config = useRuntimeConfig();
//         this.baseUrl = config.public.baseUrl as string;
//     }

//     // 错误提示函数
//     private showError(message: string): void {
//         showToast("error", "Error", message);
//     };

//     // 处理响应函数
//     private async handleResponse<T>(response: Response): Promise<IResponse<T>> {
//         // fetch会自动解析数据,进入onResponse前就已经解析过了,如果解析失败,解析的结果就是response._data
//         const contentType = response.headers.get("content-type");
//         let responseData: IResponse<T>;

//         // code !== 200 的情况
//         if (!response.ok) {
//             responseData = { code: -1, data: `Request error: ${response.statusText}` as unknown as T, headers: response.headers };
//             this.showError(`Error: ${response.statusText}`);
//             return responseData;
//         }

//         if (!contentType) {
//             responseData = { code: -1, data: "Response's content-type error" as unknown as T, headers: response.headers };
//             this.showError('Error: without content-type');
//             return responseData;
//         }

//         // 处理 JSON 类型的响应
//         if (contentType.includes('application/json')) {
//             const jsonData = await response.json();
//             responseData = { code: 1, data: jsonData, headers: response.headers };
//             return responseData;
//         }

//         // 处理 disposition
//         const disposition = response.headers.get('content-disposition');
//         if (!disposition) {
//             responseData = { code: -1, data: 'No content-disposition header' as unknown as T, headers: response.headers };
//             this.showError('Error: no content-disposition');
//             return responseData;
//         }

//         // 后端返回的文件流,也包含该请求头
//         const blob = await response.blob();
//         // 创建出ObjectURL,返回给前端
//         const blobUrl = window.URL.createObjectURL(blob);
//         responseData = { code: 1, data: blobUrl as unknown as T, headers: response.headers };
//         showToast("success", "Upload successfully", "upload process %");
//         return responseData;
//     }

//     private async fetch<T>(url: string, options?: any): Promise<IResponse<T>> {
//         return $fetch<IResponse<T>>(url, {
//             ...options,
//             baseURL: this.baseUrl,
//             onResponse: async ({ response }) => this.handleResponse<T>(response),
//             onRequest: ({ error }) => {
//                 console.log(error);
//                 this.showError('Request failed, please check your network');
//             }
//         }).catch((error) => {
//             this.showError('Uncorrected code');
//             return { code: -1, data: error.data, headers: new Headers() } as IResponse<T>;
//         });
//     }

//     public get<T>(url: string, params?: any) {
//         return this.fetch<T>(url, { method: 'get', ...params });
//     }

//     public post<T>(url: string, params?: any) {
//         return this.fetch<T>(url, { method: 'post', ...params });
//     }

//     public put<T>(url: string, params?: any) {
//         return this.fetch<T>(url, { method: 'put', ...params });
//     }

//     public delete<T>(url: string, params?: any) {
//         return this.fetch<T>(url, { method: 'delete', ...params });
//     }
// }