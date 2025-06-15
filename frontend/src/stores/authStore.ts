import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "@/services/authService.ts";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type TokenPayload = {
  token: string;
  refreshToken: string;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setTokens: (payload: Partial<TokenPayload> | null) => void;
  setUser: (user: AuthUser | null) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoadingUser: false,

      setTokens: (payload) => {
        const token = payload?.token || null;
        const refreshToken = payload?.refreshToken || null;

        set({
          token,
          refreshToken,
          isAuthenticated: !!token,
        });

        if (token) {
          get().fetchCurrentUser();
        } else {
          get().setUser(null);
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!get().token && !!user });
      },

      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) {
          get().setUser(null);
          set({ isLoadingUser: false });
          return;
        }
        set({ isLoadingUser: true });
        try {
          const userDetails = await authService.getMe(token);
          set({
            user: userDetails,
            isAuthenticated: true,
            isLoadingUser: false,
          });
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          get().logout();
          set({ isLoadingUser: false });
        }
      },

      logout: () => {
        localStorage.removeItem("auth-storage");
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoadingUser: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store", error);
          } else if (state?.token && !state.user) {
            state.isAuthenticated = true;
          } else if (state?.token && state.user) {
            state.isAuthenticated = true;
          }
        };
      },
    },
  ),
);

export const initializeAuth = () => {
  const store = useAuthStore.getState();
  if (store.token && !store.user && !store.isLoadingUser) {
    store.fetchCurrentUser();
  } else if (store.token && store.user) {
    if (!store.isAuthenticated) {
      useAuthStore.setState({ isAuthenticated: true });
    }
  }
};
