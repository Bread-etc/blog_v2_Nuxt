/**
 * 封装toast便于注入调用
 */
import { useToast } from 'primevue/usetoast';

export const showToast = (severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast", summary: string, detail: string) => {
  const toast = useToast();
  toast.add({ severity: severity, summary: summary, detail: detail, life: 3000, closable: true })
}