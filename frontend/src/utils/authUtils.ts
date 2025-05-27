import { useAuthStore } from "@/stores/authStore";

export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};
