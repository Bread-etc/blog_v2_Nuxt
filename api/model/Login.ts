/**
 * 登录参数
 */

export interface LoginParams {
  user_name: string;
  password: string;
}

export interface LoginResultModel {
  // id
  id: number;
  // 用户名
  user_name: string;
  // 密码
  password: string;
  // 角色
  role: string;
  // 昵称
  nick_name: string;
  // 创建时间
  created_time: Date | string;
  // token令牌
  token: string;
}
