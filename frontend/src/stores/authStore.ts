import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "@/services/authService.ts";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoadingUser: false,

      setToken: (token) => {
        set({ token, isAuthenticated: !!token });
        if (token) {
          console.log("Token set in Zustand store.");
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
          console.log("No token found, cannot fetch user.");
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
          console.log("Current user fetched and set:", userDetails);
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
          user: null,
          isAuthenticated: false,
          isLoadingUser: false,
        });
        console.log("User logged out from Zustand store and localStorage.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store", error);
          } else if (state?.token && !state.user) {
            console.log(
              "Auth store rehydrated. Token found. Setting isAuthenticated and attempting to fetch user.",
            );
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
    console.log(
      "Initializing auth: Token found on load, fetching current user.",
    );
    store.fetchCurrentUser();
  } else if (!store.token) {
    console.log("Initializing auth: No token found on load.");
  } else if (store.token && store.user) {
    console.log("Initializing auth: Token and user already in store.");
    if (!store.isAuthenticated) {
      useAuthStore.setState({ isAuthenticated: true });
    }
  }
};
