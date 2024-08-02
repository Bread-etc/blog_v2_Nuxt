/* 登录参数 */
export interface LoginParams {
  user_name: string;
  user_password: string;
}

export interface LoginResult {
  // 用户id
  id: number;
  // 用户名
  user_name: string;
  
}