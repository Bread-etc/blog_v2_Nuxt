/* 登录参数 */
export interface LoginParams {
  // 用户名
  user_name: string;
  // 密码
  password: string;
}

export interface LoginResult {
  // 用户id
  id: number;
  // 用户名
  user_name: string;
  // 角色
  role: string;
  // 昵称
  nick_name?: string;
  // 创建时间
  created_time: string;
}