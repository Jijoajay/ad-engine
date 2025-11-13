"use client";

import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ProjectFormData {
  proj_id: number | string;
  proj_name: string;
  proj_slug_name: string;
  proj_desc: string;
  proj_file_path: string;
  proj_url_path: string;
  proj_status: number;
  hash_id?: string | null;
  file_url?: string | null;
  file?: File | string | null;
}

export interface ProjectState {
  formData: ProjectFormData;
  projectList: ProjectFormData[];
  projectData: any;

  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  setFormData: (data: Partial<ProjectFormData>) => void;
  resetForm: () => void;
  fetchProjectList: () => Promise<void>;
  fetchProjectByHash: (hash: string) => Promise<void>;
  fetchProjectById: (hash: string) => Promise<void>;
  saveProject: (
    data: Partial<ProjectFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  changeStatus: (proj_id: string) => Promise<void>;
  deleteStatus: (id: number) => Promise<void>;
  setFormBySlug: (slug: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  formData: {
    proj_id: "",
    proj_name: "",
    proj_slug_name: "",
    proj_desc: "",
    proj_file_path: "",
    proj_url_path: "",
    proj_status: 1,
    file: null,
  },
  projectList: [],
  projectData: {},

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
        proj_id: "",
        proj_name: "",
        proj_slug_name: "",
        proj_desc: "",
        proj_file_path: "",
        proj_url_path: "",
        proj_status: 1,
        file: "",
      },
    }),

  fetchProjectList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/projects");
      set({ projectList: response.data.data });
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  fetchProjectByHash: async (hash: string) => {
    set({ loadingFetch: true });

    try {
      const response = await api.get(`/project/${hash}`);

      if (response.data?.status && response.data?.data) {
        const data = response.data.data;

        set((state) => ({
          formData: {
            ...state.formData,
            proj_id: data.proj_id || "",
            proj_name: data.proj_name || "",
            proj_desc: data.proj_desc || "",
            file: data.file_url || null,
          },
        }));
      } else {
        toast.error("Failed to fetch project details!");
      }
    } catch (error) {
      console.error("Error fetching project by hash:", error);
      toast.error("Error fetching project details!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  fetchProjectById: async (hash: string) => {
    set({ loadingFetch: true });

    try {
      const response = await api.get(`/project/${hash}`);

      if (response.data?.status && response.data?.data) {
        const data = response.data.data;
        console.log("data",data)

        set({ projectData: data });
      } else {
        toast.error("Failed to fetch project details!");
      }
    } catch (error) {
      console.error("Error fetching project by hash:", error);
      toast.error("Error fetching project details!");
    } finally {
      set({ loadingFetch: false });
    }
  },

  saveProject: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });

    try {
      const formPayload = new FormData();
      formPayload.append("proj_id", String(formData.proj_id || ""));
      formPayload.append("proj_name", data.proj_name || formData.proj_name);
      formPayload.append("proj_desc", data.proj_desc || formData.proj_desc);

      if ((data as any).file) {
        formPayload.append("file", (data as any).file);
      }

      const response = await api.post(
        "/project/create-or-update",
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.status === true) {
        toast.success("Project saved successfully!");
        await get().fetchProjectList();
        if (router) router.push("/dashboard/project");
      } else {
        toast.error(response?.data?.message || "Failed to save project!");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Error saving project!");
    } finally {
      set({ loadingSave: false });
    }
  },

  deleteProject: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/project/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Project deleted successfully!");
        await get().fetchProjectList();
      } else {
        toast.error(response?.data?.message || "Failed to delete project!");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  changeStatus: async (proj_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/project/toggle-status", { proj_id });

      if (response?.data?.status === true) {
        toast.success("Project status updated successfully!");
        await get().fetchProjectList();
      } else {
        toast.error(response?.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Error updating project status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  deleteStatus: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/project/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Project deleted successfully!");
        await get().fetchProjectList();
      } else {
        toast.error(response?.data?.message || "Failed to delete project!");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  setFormBySlug: (slug: string) => {
    const { projectList, setFormData, resetForm } = get();
    const existing = projectList.find(
      (item) => item.proj_slug_name?.toLowerCase() === slug.toLowerCase()
    );
    if (existing) {
      setFormData(existing);
    } else {
      resetForm();
    }
  },
}));
