"use client"

import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface MediaDetailFormData {
  mddt_id: number | string;
  mddt_mdty_id: number | string;
  mddt_desc: string;
  file?: File | null;
  hash_id?: string | null;
  file_url?: string | null;
}

export interface MediaDetailState {
  formData: MediaDetailFormData;
  mediaDetailList: MediaDetailFormData[];

  loadingFetch: boolean;
  loadingSave: boolean;
  loadingStatus: boolean;
  loadingDelete: boolean;

  setFormData: (data: Partial<MediaDetailFormData>) => void;
  resetForm: () => void;
  fetchMediaDetailList: () => Promise<void>;
  saveMediaDetail: (
    data: Partial<MediaDetailFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteMediaDetail: (id: number) => Promise<void>;
  changeStatus: (id: string) => Promise<void>;
  setFormByHash: (hash: string) => void;
}

export const useMediaDetailStore = create<MediaDetailState>((set, get) => ({
  formData: {
    mddt_id: "",
    mddt_mdty_id: "",
    mddt_desc: "",
    file: null,
  },
  mediaDetailList: [],

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
        mddt_id: "",
        mddt_mdty_id: "",
        mddt_desc: "",
        file: null,
      },
    }),

  fetchMediaDetailList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/media-details/list");
      if (response.data?.status) {
        set({ mediaDetailList: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching media details:", error);
      toast.error("Error fetching media details!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  saveMediaDetail: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });

    try {
      const formPayload = new FormData();
      formPayload.append("mddt_id", String(formData.mddt_id || ""));
      formPayload.append(
        "mddt_mdty_id",
        String(data.mddt_mdty_id || formData.mddt_mdty_id || "")
      );
      formPayload.append(
        "mddt_desc",
        data.mddt_desc || formData.mddt_desc || ""
      );

      if ((data as any).file) {
        formPayload.append("file", (data as any).file);
      }

      const response = await api.post(
        "/media-details/create-or-update",
        formPayload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === true) {
        toast.success("Media detail saved successfully!");
        await get().fetchMediaDetailList();
        if (router) router.push("/dashboard/media-detail");
      } else {
        toast.error(response?.data?.message || "Failed to save media detail!");
      }
    } catch (error) {
      console.error("Error saving media detail:", error);
      toast.error("Error saving media detail!");
    } finally {
      set({ loadingSave: false });
    }
  },

  deleteMediaDetail: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete("/media-details/delete", {
        data: { deletedId: id },
      });
      if (response?.data?.status === true) {
        toast.success("Media detail deleted successfully!");
        await get().fetchMediaDetailList();
      } else {
        toast.error(
          response?.data?.message || "Failed to delete media detail!"
        );
      }
    } catch (error) {
      console.error("Error deleting media detail:", error);
      toast.error("Error deleting media detail!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  changeStatus: async (hash_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/media-details/toggle-status", {
        mddt_id:hash_id,
      });

      if (response?.data?.status === true) {
        toast.success("Media detail status updated successfully!");
        await get().fetchMediaDetailList();
      } else {
        toast.error(response?.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating media detail status:", error);
      toast.error("Error updating media detail status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  setFormByHash: (hash: string) => {
    const { mediaDetailList, setFormData, resetForm } = get();
    const existing = mediaDetailList.find(
      (item) => item.hash_id?.toLowerCase() === hash.toLowerCase()
    );
    if (existing) {
      setFormData(existing);
    } else {
      resetForm();
    }
  },
}));
