import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Device {
  device_id: number | "";
  device_udid: string;
  device_dvty_id: number;
  device_position: string;
  device_created_date: string;
  device_modified_date: string | null;
  device_status: number;
  hash_id: string;
}

interface DeviceState {
  deviceList: Device[];
  formData: Partial<Device>;
  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  // Actions
  fetchDeviceList: () => Promise<void>;
  fetchDeviceByHash: (hash_id: string) => Promise<void>;
  setFormByHash: (hash_id: string) => void;
  saveDevice: (
    data: Partial<Device>,
    router: ReturnType<typeof useRouter>
  ) => Promise<void>;
  changeStatus: (device_id: number) => Promise<void>;
  deleteDevice: (device_id: number) => Promise<void>;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  deviceList: [],
  formData: {},
  loadingFetch: false,
  loadingSave: false,
  loadingDelete: false,
  loadingStatus: false,

  // Fetch all devices
  fetchDeviceList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/devices/list");
      if (response.data?.status) {
        set({ deviceList: response.data.data });
      } else {
        toast.error(response.data?.message || "Failed to load devices!");
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast.error("Error fetching devices!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  // Set formData from deviceList by hash (local)
  setFormByHash: (hash_id: string) => {
    const device = get().deviceList.find((d) => d.hash_id === hash_id);
    if (device) {
      set({ formData: device });
    } else {
      toast.error("Device not found in local list!");
    }
  },

  // Fetch single device by hash and set formData
  fetchDeviceByHash: async (hash_id: string) => {
    set({ loadingFetch: true });
    try {
      const response = await api.get(`/device/${hash_id}`);

      if (response.data?.status && response.data?.data) {
        const device: Device = response.data.data;

        // Update formData with API response
        set({ formData: { ...device } });

      } else {
        toast.error(response.data?.message || "Failed to load device!");
      }
    } catch (error) {
      console.error("Error fetching device by hash:", error);
      toast.error("Error fetching device data!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  // Save device (create or update)
  saveDevice: async (data: Partial<Device>, router) => {
    const { formData } = get();
    set({ loadingSave: true });

    try {
      const formPayload = new FormData();
      formPayload.append("device_id", String(formData.device_id || ""));
      formPayload.append(
        "device_udid",
        data.device_udid || formData.device_udid || ""
      );
      formPayload.append(
        "device_dvty_id",
        String(data.device_dvty_id || formData.device_dvty_id || "")
      );
      formPayload.append(
        "device_position",
        data.device_position || formData.device_position || ""
      );
      formPayload.append(
        "device_status",
        String(data.device_status ?? formData.device_status ?? 1)
      );

      if ((data as any).file) {
        formPayload.append("file", (data as any).file);
      }

      const response = await api.post("/device/create-or-update", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.status) {
        toast.success("Device saved successfully!");
        await get().fetchDeviceList();
        if (router) router.push("/dashboard/device");
      } else {
        toast.error(response?.data?.message || "Failed to save device!");
      }
    } catch (error) {
      console.error("Error saving device:", error);
      toast.error("Error saving device!");
    } finally {
      set({ loadingSave: false });
    }
  },

  // Change device status
  changeStatus: async (device_id: number) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/device/toggle-status", { device_id });
      if (response.data?.status) {
        toast.success("Device status updated!");
        await get().fetchDeviceList();
      } else {
        toast.error(response.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  // Delete device
  deleteDevice: async (device_id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete("/device/delete", {
        data: { device_id },
      });
      if (response.data?.status) {
        toast.success("Device deleted successfully!");
        await get().fetchDeviceList();
      } else {
        toast.error(response.data?.message || "Failed to delete device!");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Error deleting device!");
    } finally {
      set({ loadingDelete: false });
    }
  },
}));
