import api from "@/lib/api";
import { create } from "zustand";

export interface ProjectFormData {
  proj_id: number;
  proj_name: string;
  proj_slug_name: string;
  proj_desc: string;
  proj_file_path: string;
  proj_url_path: string;
  proj_created?: string;
  proj_modified?: string | null;
  proj_status: number;
  hash_id?: string | null;
  file_url?: string | null;
}

export interface ProjectState {
  formData: ProjectFormData;
  projectList: ProjectFormData[];
  loading: boolean;
  setFormData: (data: Partial<ProjectFormData>) => void;
  resetForm: () => void;
  fetchProjectList: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  formData: {
    proj_id: 0,
    proj_name: "",
    proj_slug_name: "",
    proj_desc: "",
    proj_file_path: "",
    proj_url_path: "",
    proj_status: 1,
  },
  projectList: [],
  loading: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        proj_id: 0,
        proj_name: "",
        proj_slug_name: "",
        proj_desc: "",
        proj_file_path: "",
        proj_url_path: "",
        proj_status: 1,
      },
    }),

  fetchProjectList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/projects");
      console.log("Projects Response:", response.data);
      set({ projectList: response.data.data });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
