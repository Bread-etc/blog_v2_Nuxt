/**
 * 登录参数
 */

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResultModel {
  // id
  id: number;
  // 用户名
  userName: string;
  // 密码
  // password: string;
  // 角色
  role: string;
  // 昵称
  nickName: string;
  // 创建时间
  createdTime: Date | string;
  // token令牌
  token: string;
}
