/**
 * 封装toast便于注入调用
 */
import { useToast } from "primevue/usetoast";

type ToastType =
  | "success"
  | "info"
  | "warn"
  | "error"
  | "secondary"
  | "contrast"
  | undefined;

const showToast = (
  severity: ToastType,
  summary: string,
  detail: string,
  life?: number,
) => {
  const toast = useToast();
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

export default showToast;
