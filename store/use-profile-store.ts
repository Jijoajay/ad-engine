"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "sonner";

export interface UserProfile {
  firstname: string;
  lastname: string;
  mobile_no: string;
  email: string;
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;

  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  setProfileData: (data: Partial<UserProfile>) => void;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  loading: false,
  saving: false,

  setProfileData: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data } as UserProfile,
    })),

  fetchUserProfile: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/user-profile");
      if (response?.data?.status && response.data.data) {
        set({ profile: response.data.data });
      } else {
        toast.error(response?.data?.message || "Failed to fetch profile!");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile!");
    } finally {
      set({ loading: false });
    }
  },

  updateUserProfile: async (data) => {
    set({ saving: true });
    try {
      const response = await api.post("/update-profile", data);
      if (response?.data?.status === true) {
        toast.success("Profile updated successfully!");
        await get().fetchUserProfile();
      } else {
        toast.error(response?.data?.message || "Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile!");
    } finally {
      set({ saving: false });
    }
  },
}));
