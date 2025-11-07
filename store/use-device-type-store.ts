import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface DeviceTypeFormData {
  dvty_id: number | string;
  dvty_name: string;
  dvty_desc: string;
  dvty_status: number;
}

export interface DeviceTypeState {
  formData: DeviceTypeFormData;
  deviceTypeList: DeviceTypeFormData[];

  loading: boolean;
  formLoading: boolean;

  setFormData: (data: Partial<DeviceTypeFormData>) => void;
  resetForm: () => void;
  fetchDeviceTypeList: () => Promise<void>;
  saveDeviceType: (
    data: Partial<DeviceTypeFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteDeviceType: (id: number) => Promise<void>;
  setFormBySlug: (slug: string) => void;
}

export const useDeviceTypeStore = create<DeviceTypeState>((set, get) => ({
  formData: {
    dvty_id: "",
    dvty_name: "",
    dvty_desc: "",
    dvty_status: 1,
  },
  deviceTypeList: [],
  loading: false,
  formLoading: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        dvty_id: "",
        dvty_name: "",
        dvty_desc: "",
        dvty_status: 1,
      },
    }),

  fetchDeviceTypeList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/device-types/list");
      set({ deviceTypeList: response.data.data });
    } catch (error) {
      console.error("Error fetching device types:", error);
    } finally {
      set({ loading: false });
    }
  },

  saveDeviceType: async (data, router) => {
    const { formData } = get();
    set({ formLoading: true });

    try {
      const payload = {
        ...formData,
        ...data,
        dvty_id: formData.dvty_id || null,
      };

      const response = await api.post("/device-type/create-or-update", payload);

      if (response?.data?.status === true) {
        toast.success("Device type saved successfully!");
        await get().fetchDeviceTypeList();
        if (router) router.push("/dashboard/device-type");
      } else {
        toast.error(response?.data?.message || "Failed to save device type!");
      }
    } catch (error) {
      console.error("Error saving device type:", error);
      toast.error("Error saving device type!");
    } finally {
      set({ formLoading: false });
    }
  },

  deleteDeviceType: async (id: number) => {
    set({ loading: true });
    try {
      const response = await api.delete(`/device-type/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        await get().fetchDeviceTypeList();
      } else {
        toast.error(response?.data?.message || "Failed to delete device type!");
      }
    } catch (error) {
      console.error("Error deleting device type:", error);
      toast.error("Error deleting device type!");
    } finally {
      set({ loading: false });
    }
  },
  setFormBySlug: (slug: string) => {
    const { deviceTypeList, setFormData, resetForm } = get();
    const existing = deviceTypeList.find(
      (item) => item.dvty_name.toLowerCase() === slug.toLowerCase()
    );
    if (existing) {
      setFormData(existing);
    } else {
      resetForm();
    }
  },
}));


