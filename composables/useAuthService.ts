import { toast } from "vue-sonner";
import type {
  LoginRequest,
  LoginResponse,
  PublicKeyResponse,
  User,
} from "~/types";

export const useAuthService = () => {
  const { get, post } = useApi();

  /**
   * 获取公钥
   * @returns RSA公钥用于密码加密
   */
  const getPublicKey = async () => {
    return await get<PublicKeyResponse>("/auth/getPublicKey", {
      showErrorToast: true,
    });
  };

  /**
   * 用户登录
   * @param credentials 登录凭据
   * @param loading 加载状态
   * @returns 登录结果包含token和用户信息
   */
  const login = async (credentials: LoginRequest, loading?: Ref<boolean>) => {
    const response = await post<LoginResponse>("/auth/login", credentials, {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "登录成功",
      loading,
    });

    // 如果登录成功，保存token和用户信息到cookie
    if (response && response.code === 200 && response.data) {
      const token = useCookie<string | null>("auth-token", {
        default: () => null,
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "strict",
      });
      token.value = response.data.token;

      const user = useCookie<User | null>("user-info", {
        default: () => null,
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "strict",
      });
      user.value = response.data.user;
    }

    return response;
  };

  /**
   * 用户登出（客户端处理）- 清除本地存储的token和用户信息
   */
  const logout = () => {
    const token = useCookie("auth-token");
    token.value = null;

    const user = useCookie("user-info");
    user.value = null;

    navigateTo("/login");

    toast.success("已成功登出");
  };

  /**
   * 检查用户是否已登录
   * @returns 是否已登录
   */
  const isAuthenticated = (): boolean => {
    const token = useCookie("auth-token");
    return !!token.value;
  };

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  const getCurrentUser = () => {
    const user = useCookie("user-info");
    return user.value;
  };

  return {
    getPublicKey,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
  };
};
