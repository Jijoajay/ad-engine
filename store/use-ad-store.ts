"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "sonner";

// Interfaces
export interface Project {
  proj_name: string;
  proj_id: number;
  hash_id: string;
}

export interface ProjectPage {
  page_id: number;
  page_name: string;
  page_proj_id: number;
  setg_id: number;
  hash_id: string;
}

export interface Advertisement {
  advt_id: number;
  advt_user_id: number;
  advt_setg_id: number;
  advt_ordt_id: number | null;
  advt_media_path: string | null;
  advt_view_count: number;
  advt_click_count: number;
  advt_charges: string;
  advt_payment_status: number;
  advt_created_date: string;
  advt_modified_date: string | null;
  advt_status: number;
  proj_name?: string;
  proj_id?: number;
  page_id?: number;
  page_name?: string;
  page_proj_id?: number;
  hash_id: string;
  file_url: string | null;
}

export interface AdPosition {
  setg_id: number;
  setg_page_id: number;
  setg_ad_position: string;
  setg_ad_desc: string;
  setg_view_count: number | string;
  setg_click_count: number | string;
}

export interface AdState {
  projects: Project[];
  projectPages: ProjectPage[];
  advertisements: Advertisement[];
  adminAdvertisements: Advertisement[];
  projectList: Project[];
  pagesByProject: Record<number, ProjectPage[]>;
  adPositionsByPage: Record<number, AdPosition[]>;
  loading: boolean;
  error: string | null;
  fetchAdData: () => Promise<void>;
  fetchAllAdminAd: () => Promise<void>;
  saveAd: (payload: FormData) => Promise<boolean>;
  toggleAdStatus: (advt_id: string) => Promise<boolean>;
  deleteAd: (deletedId: string) => Promise<boolean>; // New method
}

// Store Implementation
export const useAdStore = create<AdState>((set, get) => ({
  projects: [],
  projectPages: [],
  advertisements: [],
  adminAdvertisements: [],
  projectList: [],
  pagesByProject: {},
  adPositionsByPage: {},
  loading: false,
  error: null,

  // Fetch All Ad Data
  fetchAdData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/get-un-set-advertisements");

      if (res.data?.status) {
        const { projects, project_pages, advertisements, adPositions } =
          res.data.data;

        // Group pages by project
        const pagesByProject: Record<number, ProjectPage[]> = {};
        project_pages.forEach((page: ProjectPage) => {
          if (!pagesByProject[page.page_proj_id])
            pagesByProject[page.page_proj_id] = [];
          pagesByProject[page.page_proj_id].push(page);
        });

        // Group ad positions by page
        const adPositionsByPage: Record<number, AdPosition[]> = {};
        if (adPositions) {
          adPositions.forEach((pos: AdPosition) => {
            if (!adPositionsByPage[pos.setg_page_id])
              adPositionsByPage[pos.setg_page_id] = [];
            adPositionsByPage[pos.setg_page_id].push(pos);
          });
        }

        set({
          projects,
          projectPages: project_pages,
          advertisements,
          projectList: projects,
          pagesByProject,
          adPositionsByPage,
          loading: false,
        });
      } else {
        // toast.error(res.data?.message || "Failed to fetch advertisements");
        console.log("error", res.data?.message)
        set({ loading: false });
      }
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      toast.error("Something went wrong while fetching ad data");
      set({ loading: false, error: error.message });
    }
  },

  // Fetch All Admin Advertisements
  fetchAllAdminAd: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/user-advertisements?isAdmin=1");

      if (res.data?.status && Array.isArray(res.data.data)) {
        set({ adminAdvertisements: res.data.data, loading: false });
      } else {
        toast.error(res.data?.message || "Failed to fetch admin advertisements");
        set({ loading: false });
      }
    } catch (error: any) {
      console.error("❌ Admin fetch error:", error);
      toast.error("Something went wrong while fetching admin ads");
      set({ loading: false, error: error.message });
    }
  },

  // Save Advertisement
  saveAd: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/user-advertisement/set-ad-details", payload);
      if (res.data?.status) {
        toast.success("Advertisement saved successfully!");
        set({ loading: false });
        return true;
      } else {
        toast.error(res.data?.message || "Failed to save advertisement");
        set({ loading: false });
        return false;
      }
    } catch (error: any) {
      console.error("❌ Save error:", error);
      toast.error("Something went wrong while saving ad details");
      set({ loading: false, error: error.message });
      return false;
    }
  },

  // Toggle Advertisement Status
  toggleAdStatus: async (advt_id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put("/user-advertisement/toggle-status", { advt_id });

      if (res.data?.status) {
        toast.success("Advertisement status updated successfully!");

        const updatedAds = get().adminAdvertisements.map((ad) =>
          ad.hash_id === advt_id
            ? { ...ad, advt_status: ad.advt_status === 1 ? 0 : 1 }
            : ad
        );

        set({ adminAdvertisements: updatedAds, loading: false });
        return true;
      } else {
        toast.error(res.data?.message || "Failed to change ad status");
        set({ loading: false });
        return false;
      }
    } catch (error: any) {
      console.error("❌ Toggle status error:", error);
      toast.error("Something went wrong while changing ad status");
      set({ loading: false, error: error.message });
      return false;
    }
  },

  // Delete Advertisement
  deleteAd: async (deletedId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.delete("/user-advertisement/delete", {
        data: { deletedId },
      });

      if (res.data?.status) {
        toast.success("Advertisement deleted successfully!");

        const updatedAds = get().adminAdvertisements.filter(
          (ad) => ad.hash_id !== deletedId
        );

        set({ adminAdvertisements: updatedAds, loading: false });
        return true;
      } else {
        toast.error(res.data?.message || "Failed to delete advertisement");
        set({ loading: false });
        return false;
      }
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      toast.error("Something went wrong while deleting advertisement");
      set({ loading: false, error: error.message });
      return false;
    }
  },
}));
