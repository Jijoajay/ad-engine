import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AxiosError } from "axios";
import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  user_type: number | string;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingChangePass: boolean;
  error: string | null;
  registerError: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (formData: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  changePassword: (formData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => Promise<boolean>;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      user_type: null,
      isAuthenticated: false,
      loading: false,
      loadingChangePass: false,
      error: null,
      registerError: null,

      // 🟢 Register
      register: async (formData) => {
        set({ loading: true, error: null });
        try {
          const payload = {
            ...formData,
            user_type: 1,
            first_login: 2,
          };

          const { data } = await api.post("/register", payload);

          if (!data.status)
            throw new Error(data.message || "Registration failed");

          set({ loading: false });
          return true;
        } catch (err) {
          const error = err as AxiosError<{ message?: string }>;
          set({
            loading: false,
            registerError:
              error.response?.data?.message ||
              error.message ||
              "Registration failed. Try again.",
          });
          return false;
        }
      },

      // 🔐 Login
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

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });

          return true;
        } catch (e) {
          console.warn("Logout request failed:", e);

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: "Logout failed. Try again.",
          });

          return false;
        }
      },

      // Change Password
      changePassword: async (formData) => {
        const { token } = get();
        set({ loadingChangePass: true, error: null });

        try {
          const { data } = await api.post("/change-password", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!data.status) throw new Error(data.message || "Password update failed");

          set({ loadingChangePass: false });
          return true;
        } catch (err) {
          const error = err as AxiosError<{ message?: string }>;
          set({
            loadingChangePass: false,
            error:
              error.response?.data?.message ||
              error.message ||
              "Failed to change password. Try again.",
          });
          return false;
        }
      },

      // Set user
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      // 🧹 Clear error
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
