import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface AdSettingFormData {
  setg_id: number | string;
  setg_proj_id: number | string;
  setg_page_id: number | string;
  setg_trgt_id: number | string;
  setg_dvty_id: number | string;
  setg_mddt_id: number | string;
  setg_ad_position: string;
  setg_ad_desc: string;
  setg_ad_size: string;
  setg_view_count: number | string;
  setg_click_count: number | string;
  setg_ad_charges: number | string;
  setg_status: number;
  hash_id?: string | null;
}

export interface AdSettingState {
  formData: AdSettingFormData;
  adSettingList: AdSettingFormData[];

  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  setFormData: (data: Partial<AdSettingFormData>) => void;
  resetForm: () => void;
  fetchAdSettingList: () => Promise<void>;
  saveAdSetting: (
    data: Partial<AdSettingFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteAdSetting: (id: number) => Promise<void>;
  changeStatus: (setg_id: string) => Promise<void>;
  setFormByHash: (hash: string) => void;
}

export const useAdSettingStore = create<AdSettingState>((set, get) => ({
  formData: {
    setg_id: "",
    setg_proj_id: "",
    setg_page_id: "",
    setg_trgt_id: "",
    setg_dvty_id: "",
    setg_mddt_id: "",
    setg_ad_position: "",
    setg_ad_desc: "",
    setg_ad_size: "",
    setg_view_count: "",
    setg_click_count: "",
    setg_ad_charges: "",
    setg_status: 1,
    hash_id: null,
  },
  adSettingList: [],

  loadingFetch: false,
  loadingSave: false,
  loadingDelete: false,
  loadingStatus: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        setg_id: "",
        setg_proj_id: "",
        setg_page_id: "",
        setg_trgt_id: "",
        setg_dvty_id: "",
        setg_mddt_id: "",
        setg_ad_position: "",
        setg_ad_desc: "",
        setg_ad_size: "",
        setg_view_count: "",
        setg_click_count: "",
        setg_ad_charges: "",
        setg_status: 1,
        hash_id: null,
      },
    }),

  fetchAdSettingList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/ad-settings");
      if (response.data?.status) {
        set({ adSettingList: response.data.data });
      } else {
        toast.error(response.data?.message || "Failed to fetch ad settings!");
      }
    } catch (error) {
      console.error("Error fetching ad settings:", error);
      toast.error("Error fetching ad settings!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  saveAdSetting: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });
    try {
      const payload = {
        ...formData,
        ...data,
        setg_id: formData.setg_id || null,
      };

      const response = await api.post("/ad-settings/create-or-update", payload);

      if (response?.data?.status === true) {
        toast.success("Ad setting saved successfully!");
        await get().fetchAdSettingList();
        if (router) router.push("/dashboard/ad-setting");
      } else {
        toast.error(response?.data?.message || "Failed to save ad setting!");
      }
    } catch (error) {
      console.error("Error saving ad setting:", error);
      toast.error("Error saving ad setting!");
    } finally {
      set({ loadingSave: false });
    }
  },

  deleteAdSetting: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/ad-settings/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Ad setting deleted successfully!");
        await get().fetchAdSettingList();
      } else {
        toast.error(response?.data?.message || "Failed to delete ad setting!");
      }
    } catch (error) {
      console.error("Error deleting ad setting:", error);
      toast.error("Error deleting ad setting!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  changeStatus: async (setg_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/ad-settings/toggle-status", { setg_id });

      if (response?.data?.status === true) {
        toast.success("Ad setting status updated successfully!");
        await get().fetchAdSettingList();
      } else {
        toast.error(response?.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating ad setting status:", error);
      toast.error("Error updating ad setting status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  setFormByHash: (hash: string) => {
    const { adSettingList, setFormData, resetForm } = get();
    const existing = adSettingList.find(
      (item) => item.hash_id?.toLowerCase() === hash.toLowerCase()
    );
    if (existing) {
      setFormData(existing);
    } else {
      resetForm();
    }
  },
}));
