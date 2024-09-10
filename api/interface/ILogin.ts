/**
 * 登录登出接口
 */

import { useHttp } from "~/composables/useHttp";
import type { LoginParams, LoginResultModel } from "~/api/model/Login";

enum Api {
  login = "/auth/login",
  logout = "/auth/logout",
}

// 登录
export async function login(params: LoginParams) {
  return useHttp.post<LoginResultModel>(Api.login, params);
}

// 登出
export async function logout() {
  return useHttp.post<string>(Api.logout);
}
