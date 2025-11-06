import api from "@/lib/api";
import { create } from "zustand";

interface Device {
  device_id: number;
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
  loading: boolean;
  fetchDeviceList: () => Promise<void>;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceList: [],
  loading: false,

  fetchDeviceList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/devices/list");
      if (response.data?.status) {
        set({ deviceList: response.data.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      set({ loading: false });
    }
  },
}));
