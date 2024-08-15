import api from "~/api/index";
import { encrypt } from "~/composables/useEncrypt";

// 管理composables下hook
export const useApi = () => api;
export const useEncrypt = () => encrypt;
