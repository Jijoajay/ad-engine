"use client"

import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface MediaTypeFormData {
  mdty_id: number | string;
  mdty_name: string;
  mdty_status: number;
  mdty_created_date?: string;
  mdty_modified_date?: string | null;
  hash_id?: string | null;
}

export interface MediaTypeState {
  formData: MediaTypeFormData;
  mediaTypeList: MediaTypeFormData[];
  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  setFormData: (data: Partial<MediaTypeFormData>) => void;
  resetForm: () => void;
  fetchMediaTypeList: () => Promise<void>;
  saveMediaType: (
    data: Partial<MediaTypeFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteMediaType: (id: number) => Promise<void>;
  changeStatus: (hash_id: string) => Promise<void>;
  setFormByHash: (hash: string) => Promise<void>;
}

export const useMediaTypeStore = create<MediaTypeState>((set, get) => ({
  formData: {
    mdty_id: 0,
    mdty_name: "",
    mdty_status: 1,
  },
  mediaTypeList: [],

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
        mdty_id: 0,
        mdty_name: "",
        mdty_status: 1,
      },
    }),

  fetchMediaTypeList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/media-types/list");
      if (response.data?.status) {
        set({ mediaTypeList: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching media types:", error);
      toast.error("Error fetching media types!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  saveMediaType: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });

    try {
      const formPayload = new FormData();
      formPayload.append("mdty_id", String(formData.mdty_id || ""));
      formPayload.append("mdty_name", data.mdty_name || formData.mdty_name);
      formPayload.append(
        "mdty_status",
        String(data.mdty_status ?? formData.mdty_status)
      );

      const response = await api.post(
        "/media-type/create-or-update",
        formPayload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === true) {
        toast.success("Media type saved successfully!");
        await get().fetchMediaTypeList();
        if (router) router.push("/dashboard/media-type");
      } else {
        toast.error(response?.data?.message || "Failed to save media type!");
      }
    } catch (error) {
      console.error("Error saving media type:", error);
      toast.error("Error saving media type!");
    } finally {
      set({ loadingSave: false });
    }
  },

  deleteMediaType: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete("/media-type/delete", {
        data: { deletedId: id },
      });
      if (response?.data?.status === true) {
        toast.success("Media type deleted successfully!");
        await get().fetchMediaTypeList();
      } else {
        toast.error(response?.data?.message || "Failed to delete media type!");
      }
    } catch (error) {
      console.error("Error deleting media type:", error);
      toast.error("Error deleting media type!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  changeStatus: async (hash_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/media-type/toggle-status", {
        mdty_id: hash_id,
      });
      if (response?.data?.status === true) {
        toast.success("Media type status updated successfully!");
        await get().fetchMediaTypeList();
      } else {
        toast.error(response?.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating media type status:", error);
      toast.error("Error updating media type status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  setFormByHash: async (hash: string) => {
    const { setFormData, resetForm } = get();
    set({ loadingFetch: true });

    try {
      const response = await api.get(`/media-type/${hash}`);
      if (response?.data?.status && response.data?.data) {
        const data = response.data.data;
        setFormData({
          mdty_id: data.mdty_id,
          mdty_name: data.mdty_name,
          mdty_status: data.mdty_status,
        });
      } else {
        resetForm();
        toast.error("No media type found!");
      }
    } catch (error) {
      console.error("Error fetching media type by hash:", error);
      toast.error("Error fetching media type!");
      resetForm();
    } finally {
      set({ loadingFetch: false });
    }
  },
}));
