import api from "@/lib/api";
import { create } from "zustand";

interface MediaDetail {
  mddt_id: number;
  mddt_mdty_id: number;
  mddt_name: string;
  mddt_desc: string;
  mddt_path: string;
  mddt_created_date: string;
  mddt_modified_date: string | null;
  mddt_status: number;
  hash_id: string;
  file_url: string;
}

interface MediaDetailState {
  mediaDetailList: MediaDetail[];
  loading: boolean;
  fetchMediaDetailList: () => Promise<void>;
}

export const useMediaDetailStore = create<MediaDetailState>((set) => ({
  mediaDetailList: [],
  loading: false,

  fetchMediaDetailList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/media-details/list");
      if (response.data?.status) {
        set({ mediaDetailList: response.data.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching media details:", error);
      set({ loading: false });
    }
  },
}));
