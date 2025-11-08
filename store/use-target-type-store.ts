"use client"

import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface TargetTypeFormData {
  trgt_id: number | string;
  trgt_name: string;
  trgt_status: number;
  hash_id?: string | null;
}

export interface TargetTypeState {
  formData: TargetTypeFormData;
  targetTypeList: TargetTypeFormData[];

  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  setFormData: (data: Partial<TargetTypeFormData>) => void;
  resetForm: () => void;
  fetchTargetTypeList: () => Promise<void>;
  saveTargetType: (
    data: Partial<TargetTypeFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteTargetType: (id: number) => Promise<void>;
  changeStatus: (trgt_id: string) => Promise<void>;
  deleteStatus: (id: number) => Promise<void>;
  setFormByHash: (hash: string) => void;
}

export const useTargetTypeStore = create<TargetTypeState>((set, get) => ({
  formData: {
    trgt_id: "",
    trgt_name: "",
    trgt_status: 1,
    hash_id: null,
  },
  targetTypeList: [],

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
        trgt_id: "",
        trgt_name: "",
        trgt_status: 1,
        hash_id: null,
      },
    }),

  fetchTargetTypeList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/target-types");
      if (response.data?.status) {
        set({ targetTypeList: response.data.data });
      } else {
        toast.error(response.data?.message || "Failed to fetch target types!");
      }
    } catch (error) {
      console.error("Error fetching target types:", error);
      toast.error("Error fetching target types!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  saveTargetType: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });
    try {
      const formPayload = new FormData();
      formPayload.append("trgt_id", String(formData.trgt_id || ""));
      formPayload.append("trgt_name", data.trgt_name || formData.trgt_name);

      const response = await api.post(
        "/target-type/create-or-update",
        formPayload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === true) {
        toast.success("Target type saved successfully!");
        await get().fetchTargetTypeList();
        if (router) router.push("/dashboard/target-type");
      } else {
        toast.error(response?.data?.message || "Failed to save target type!");
      }
    } catch (error) {
      console.error("Error saving target type:", error);
      toast.error("Error saving target type!");
    } finally {
      set({ loadingSave: false });
    }
  },

  deleteTargetType: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/target-type/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Target type deleted successfully!");
        await get().fetchTargetTypeList();
      } else {
        toast.error(response?.data?.message || "Failed to delete target type!");
      }
    } catch (error) {
      console.error("Error deleting target type:", error);
      toast.error("Error deleting target type!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  changeStatus: async (trgt_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/target-type/toggle-status", { trgt_id });

      if (response?.data?.status === true) {
        toast.success("Target type status updated successfully!");
        await get().fetchTargetTypeList();
      } else {
        toast.error(response?.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating target type status:", error);
      toast.error("Error updating target type status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  deleteStatus: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/target-type/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Target type deleted successfully!");
        await get().fetchTargetTypeList();
      } else {
        toast.error(response?.data?.message || "Failed to delete target type!");
      }
    } catch (error) {
      console.error("Error deleting target type:", error);
      toast.error("Error deleting target type!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  setFormByHash: (hash: string) => {
    const { targetTypeList, setFormData, resetForm } = get();
    const existing = targetTypeList.find(
      (item) => item.hash_id?.toLowerCase() === hash.toLowerCase()
    );
    if (existing) {
      setFormData(existing);
    } else {
      resetForm();
    }
  },
}));
