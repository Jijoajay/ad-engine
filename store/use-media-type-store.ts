import api from "@/lib/api";
import { create } from "zustand";

export interface MediaTypeFormData {
  mdty_id: number;
  mdty_name: string;
  mdty_created_date?: string;
  mdty_modified_date?: string | null;
  mdty_status: number;
  hash_id?: string;
}

export interface MediaTypeState {
  formData: MediaTypeFormData;
  mediaTypeList: MediaTypeFormData[];
  loading: boolean;
  setFormData: (data: Partial<MediaTypeFormData>) => void;
  resetForm: () => void;
  fetchMediaTypeList: () => Promise<void>;
}

export const useMediaTypeStore = create<MediaTypeState>((set) => ({
  formData: {
    mdty_id: 0,
    mdty_name: "",
    mdty_status: 1,
  },
  mediaTypeList: [],
  loading: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        mdty_id: 0,
        mdty_name: "",
        mdty_status: 1,
      },
    }),

  fetchMediaTypeList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/media-types/list");
      console.log("Media Types Response:", response.data);
      set({ mediaTypeList: response.data.data });
    } catch (error) {
      console.error("Error fetching media types:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
