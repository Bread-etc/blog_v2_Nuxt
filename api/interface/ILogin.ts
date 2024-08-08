/**
 * 登录登出接口
 */

import { useHttp } from "~/composables/useHttp";
import type { LoginParams, LoginResultModel } from "model/Login";

enum Api {
  login = "/admin/login",
  logout = "/admin/logout",
  getUserInfo = "/admin/getUserInfo",
}

// 登录
export async function login(params: LoginParams) {
  return useHttp.post<LoginResultModel>(Api.login, params);
}

// 登出
export async function logout() {
  return useHttp.post<void>(Api.logout);
}

// 获取用户信息
export async function getUserInfo() {
  return useHttp.get(Api.getUserInfo);
}
