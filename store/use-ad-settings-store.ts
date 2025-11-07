import api from "@/lib/api";
import { create } from "zustand";

interface AdSetting {
  setg_id: number;
  setg_proj_id: number;
  setg_page_id: number;
  setg_trgt_id: number;
  setg_dvty_id: number;
  setg_mddt_id: number;
  setg_ad_position: string;
  setg_ad_desc: string;
  setg_ad_size: string;
  setg_view_count: number;
  setg_click_count: number;
  setg_ad_charges: string;
  file_url: string;
  project_name: string;
  project_page_name: string;
  hash_id: string;
}

interface AdSettingsState {
  adSettings: AdSetting[] | null;
  loadingAdSettings: boolean;
  error: string | null;
  fetchAdSettings: (projectHash: string, pageHash: string) => Promise<void>;
}

export const useAdSettingsStore = create<AdSettingsState>((set) => ({
  adSettings: null,
  loadingAdSettings: false,
  error: null,

  fetchAdSettings: async (projectHash, pageHash) => {
    try {
      set({ loadingAdSettings: true, error: null });
      const response = await api.get(`/get-ad-settings/${projectHash}/${pageHash}`);
      if (response.data?.status) {
        set({ adSettings: response.data.data, loadingAdSettings: false });
      } else {
        set({ error: response.data?.message || "Something went wrong", loadingAdSettings: false });
      }
    } catch (error: any) {
      console.error("Error fetching ad settings:", error);
      set({ error: error.message || "Failed to load ad settings", loadingAdSettings: false });
    }
  },
}));
