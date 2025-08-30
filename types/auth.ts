import type { ID, Timestamp } from "./common";

// 用户基础信息类型
export interface User {
  id: ID;
  userName: string;
  email: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 登录请求类型
export interface LoginRequest {
  userName: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Token 验证响应类型
export interface TokenValidationResponse {
  valid: boolean;
  user?: User;
  expiresAt?: Timestamp;
}

// 公钥响应类型
export interface PublicKeyResponse {
  publicKey: string;
  keyId?: string;
}

// 用户状态类型
export interface UserState {
  user: User | null;
  token: string | null;
  isLogin: boolean;
}
