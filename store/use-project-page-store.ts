import api from "@/lib/api";
import { create } from "zustand";

export interface ProjectPageFormData {
  page_id: number;
  page_proj_id: number;
  page_name: string;
  page_created?: string;
  page_modified?: string | null;
  page_status: number;
  hash_id?: string;
}

export interface ProjectPageState {
  formData: ProjectPageFormData;
  projectPageList: ProjectPageFormData[];
  projectPageListByHash: ProjectPageFormData[];
  loadingHash: boolean;
  loading: boolean;
  setFormData: (data: Partial<ProjectPageFormData>) => void;
  resetForm: () => void;
  fetchProjectPageList: () => Promise<void>;
  fetchProjectPageByHashId: (hashId: string) => Promise<void>;
}

export const useProjectPageStore = create<ProjectPageState>((set) => ({
  formData: {
    page_id: 0,
    page_proj_id: 0,
    page_name: "",
    page_status: 1,
  },
  projectPageList: [],
  projectPageListByHash: [],
  loading: false,
  loadingHash: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        page_id: 0,
        page_proj_id: 0,
        page_name: "",
        page_status: 1,
      },
    }),

  // get all the project page
  fetchProjectPageList: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/project-pages");
      console.log("Project Pages Response:", response.data);
      set({ projectPageList: response.data.data });
    } catch (error) {
      console.error("Error fetching project pages:", error);
    } finally {
      set({ loading: false });
    }
  },

  // fetch pages for a particular project 
  fetchProjectPageByHashId: async (hashId: string) => {
    set({ loadingHash: true });
    try {
      const response = await api.get(`/get-project-pages/${hashId}`);
      set({ projectPageListByHash: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching project pages by hash id:", error);
      set({ projectPageList: [] });
    } finally {
      set({ loadingHash: false });
    }
  },
}));
