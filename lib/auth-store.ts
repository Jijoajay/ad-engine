import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AxiosError } from "axios";
import api from "./api"

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          const { data } = await api.post("/login", { email, password });

          if (!data.status || !data.data?.token) {
            throw new Error(data.message || "Login failed");
          }

          const user = data.data;
          const token = user.token;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return true;
        } catch (err) {
          const error = err as AxiosError<{ message?: string }>;
          set({
            loading: false,
            error:
              error.response?.data?.message ||
              error.message ||
              "Login failed. Try again.",
          });
          return false;
        }
      },

      // 🚪 Logout
      logout: async () => {
        const { token } = get();
        set({ loading: true });

        try {
          if (token) {
            await api.post(
              "/logout",
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        } catch (e) {
          console.warn("Logout request failed:", e);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      clearError: () => set({ error: null }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("🔄 AuthStore rehydrated:", {
          user: state?.user,
          isAuthenticated: state?.isAuthenticated,
        });
      },
    }
  )
);
