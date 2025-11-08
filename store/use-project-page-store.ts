import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ProjectPageFormData {
  page_id: number | string;
  page_proj_id: number | string;
  page_name: string;
  page_status: number;
  hash_id?: string | null;
}

export interface ProjectPageState {
  formData: ProjectPageFormData;
  projectPageList: ProjectPageFormData[];
  projectPageListByHash: ProjectPageFormData[];


  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;
  loadingHash: boolean;

  setFormData: (data: Partial<ProjectPageFormData>) => void;
  resetForm: () => void;
  fetchProjectPageList: () => Promise<void>;
  saveProjectPage: (
    data: Partial<ProjectPageFormData>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<void>;
  deleteProjectPage: (id: number) => Promise<void>;
  changeStatus: (page_id: string) => Promise<void>;
  deleteStatus: (id: number) => Promise<void>;
  setFormByHash: (hash: string) => void;
  fetchProjectPageByHashId: (hashId: string) => Promise<void>;

}

export const useProjectPageStore = create<ProjectPageState>((set, get) => ({
  formData: {
    page_id: "",
    page_proj_id: "",
    page_name: "",
    page_status: 1,
  },
  projectPageList: [],
   projectPageListByHash: [],

  loadingFetch: false,
  loadingSave: false,
  loadingDelete: false,
  loadingStatus: false,
  loadingHash: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      formData: {
        page_id: "",
        page_proj_id: "",
        page_name: "",
        page_status: 1,
      },
    }),

  fetchProjectPageList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/project-pages");
      set({ projectPageList: response.data.data });
    } catch (error) {
      console.error("Error fetching project pages:", error);
      toast.error("Error fetching project pages!");
    } finally {
      set({ loadingFetch: false });
    }
  },

    // new: fetch pages for a particular project by hash_id
  fetchProjectPageByHashId: async (hashId: string) => {
    set({ loadingHash: true });
    try {
      const response = await api.get(`/get-project-pages/${hashId}`);
      console.log("Fetched Project Pages by Hash ID:", response.data);
      set({ projectPageListByHash: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching project pages by hash id:", error);
      set({ projectPageListByHash: [] });
    } finally {
      set({ loadingHash: false });
    }
  },

  saveProjectPage: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });

    try {
      const formPayload = new FormData();
      formPayload.append("page_id", String(formData.page_id || ""));
      formPayload.append("page_name", data.page_name || formData.page_name);
      formPayload.append(
        "page_proj_id",
        String(data.page_proj_id || formData.page_proj_id)
      );

      const response = await api.post(
        "/project-page/create-or-update",
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.status === true) {
        toast.success("Project page saved successfully!");
        await get().fetchProjectPageList();
        if (router) router.push("/dashboard/project-page");
      } else {
        toast.error(response?.data?.message || "Failed to save project page!");
      }
    } catch (error) {
      console.error("Error saving project page:", error);
      toast.error("Error saving project page!");
    } finally {
      set({ loadingSave: false });
    }
  },

  deleteProjectPage: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/project-page/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Project page deleted successfully!");
        await get().fetchProjectPageList();
      } else {
        toast.error(response?.data?.message || "Failed to delete project page!");
      }
    } catch (error) {
      console.error("Error deleting project page:", error);
      toast.error("Error deleting project page!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  changeStatus: async (page_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put("/project-page/toggle-status", { page_id });

      if (response?.data?.status === true) {
        toast.success("Project page status updated successfully!");
        await get().fetchProjectPageList();
      } else {
        toast.error(response?.data?.message || "Failed to update status!");
      }
    } catch (error) {
      console.error("Error updating project page status:", error);
      toast.error("Error updating project page status!");
    } finally {
      set({ loadingStatus: false });
    }
  },

  deleteStatus: async (id: number) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(`/project-page/delete`, {
        data: { deletedId: id },
      });

      if (response?.data?.status === true) {
        toast.success("Project page deleted successfully!");
        await get().fetchProjectPageList();
      } else {
        toast.error(response?.data?.message || "Failed to delete project page!");
      }
    } catch (error) {
      console.error("Error deleting project page:", error);
      toast.error("Error deleting project page!");
    } finally {
      set({ loadingDelete: false });
    }
  },

  setFormByHash: (hash: string) => {
    const { projectPageList, setFormData, resetForm } = get();
    const existing = projectPageList.find(
      (item) => item.hash_id?.toLowerCase() === hash.toLowerCase()
    );
    if (existing) {
      setFormData(existing);
    } else {
      resetForm();
    }
  },
}));
