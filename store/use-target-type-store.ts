import api from "@/lib/api";
import { create } from "zustand";

interface TargetType {
  trgt_id: number;
  trgt_name: string;
  trgt_created_date: string;
  trgt_modified_date: string | null;
  trgt_status: number;
  hash_id: string;
}

interface TargetTypeState {
  targetTypeList: TargetType[];
  loading: boolean;
  fetchTargetTypeList: () => Promise<void>;
}

export const useTargetTypeStore = create<TargetTypeState>((set) => ({
  targetTypeList: [],
  loading: false,

  fetchTargetTypeList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/target-types");
      if (response.data?.status) {
        set({ targetTypeList: response.data.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching target types:", error);
      set({ loading: false });
    }
  },
}));
