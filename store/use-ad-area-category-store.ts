import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// types

export interface AdAreaCategory {
  adac_id: number | "";
  adac_name: string;
  adac_desc: string;
  adac_created_date?: string;
  adac_modified_date?: string | null;
  adac_status?: number;
  hash_id?: string;
}

interface AdAreaCategoryState {
  adAreaCategoryList: AdAreaCategory[];
  formData: Partial<AdAreaCategory>;

  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  // Actions
  fetchAdAreaCategoryList: () => Promise<void>;
  fetchAdAreaCategoryByHash: (hash_id: string) => Promise<void>;
  setFormByHash: (hash_id: string) => void;

  saveAdAreaCategory: (
    data: Partial<AdAreaCategory>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<AdAreaCategory | null>;

  saveAdAreaCategoryAndReturn: (
    data: Partial<AdAreaCategory>
  ) => Promise<AdAreaCategory | null>;

  changeStatus: (hash_id: string) => Promise<void>;
  deleteAdAreaCategory: (hash_id: string) => Promise<void>;
  resetForm: () => void;
}


export const useAdAreaCategoryStore = create<AdAreaCategoryState>(
  (set, get) => ({
    adAreaCategoryList: [],
    formData: {},

    loadingFetch: false,
    loadingSave: false,
    loadingDelete: false,
    loadingStatus: false,


    resetForm: () => {
      set({
        formData: {},
        loadingFetch: false,
        loadingSave: false,
      });
    },


    fetchAdAreaCategoryList: async () => {
      set({ loadingFetch: true });
      try {
        const response = await api.get("/ad-area-categiries");

        if (response.data?.status) {
          set({ adAreaCategoryList: response.data.data });
        } else {
          toast.error(
            response.data?.message ||
              "Failed to load ad area categories!"
          );
        }
      } catch (error) {
        console.error("Error fetching ad area categories:", error);
      } finally {
        set({ loadingFetch: false });
      }
    },


    setFormByHash: (hash_id: string) => {
      const category = get().adAreaCategoryList.find(
        (item) => item.hash_id === hash_id
      );

      if (category) {
        set({ formData: category });
      } else {
        toast.error("Ad area category not found!");
      }
    },


    fetchAdAreaCategoryByHash: async (hash_id: string) => {
      set({ loadingFetch: true });
      try {
        const response = await api.get(
          `/ad-area-category/${hash_id}`
        );

        if (response.data?.status && response.data?.data) {
          set({ formData: response.data.data });
        } else {
          toast.error(
            response.data?.message ||
              "Failed to load ad area category!"
          );
        }
      } catch (error) {
        console.error(
          "Error fetching ad area category:",
          error
        );
      } finally {
        set({ loadingFetch: false });
      }
    },


    saveAdAreaCategory: async (data, router) => {
      const { formData } = get();
      set({ loadingSave: true });

      try {
        const payload = {
          adac_id: formData.adac_id || "",
          adac_name: data.adac_name ?? formData.adac_name,
          adac_desc: data.adac_desc ?? formData.adac_desc,
        };

        const response = await api.post(
          "/ad-area-category/create-or-update",
          payload
        );

        if (response.data?.status) {
          toast.success(
            "Ad area category saved successfully!"
          );
          await get().fetchAdAreaCategoryList();

          if (router) {
            router.push("/dashboard/ad-area-category");
          }

          return response.data.data as AdAreaCategory;
        } else {
          toast.error(
            response.data?.message ||
              "Failed to save ad area category!"
          );
        }

        return null;
      } catch (error) {
        console.error(
          "Error saving ad area category:",
          error
        );
        toast.error("Error saving ad area category!");
        return null;
      } finally {
        set({ loadingSave: false });
      }
    },


    saveAdAreaCategoryAndReturn: async (data) => {
      const { formData } = get();

      try {
        const payload = {
          adac_id: formData.adac_id || "",
          adac_name: data.adac_name ?? formData.adac_name,
          adac_desc: data.adac_desc ?? formData.adac_desc,
        };

        const response = await api.post(
          "/ad-area-category/create-or-update",
          payload
        );

        if (response.data?.status) {
          return response.data.data as AdAreaCategory;
        }

        return null;
      } catch (error) {
        console.error(
          "Error saving ad area category:",
          error
        );
        return null;
      }
    },


    changeStatus: async (hash_id: string) => {
      set({ loadingStatus: true });
      try {
        const response = await api.put(
          "/ad-area-category/toggle-status",
          { adac_id: hash_id }
        );

        if (response.data?.status) {
          toast.success("Status updated successfully!");
          await get().fetchAdAreaCategoryList();
        } else {
          toast.error(
            response.data?.message ||
              "Failed to update status!"
          );
        }
      } catch (error) {
        console.error("Error changing status:", error);
        toast.error("Error updating status!");
      } finally {
        set({ loadingStatus: false });
      }
    },


    deleteAdAreaCategory: async (hash_id: string) => {
      set({ loadingDelete: true });
      try {
        const response = await api.delete(
          "/ad-area-category/delete",
          {
            data: { deletedId: hash_id },
          }
        );

        if (response.data?.status) {
          toast.success(
            "Ad area category deleted successfully!"
          );
          await get().fetchAdAreaCategoryList();
        } else {
          toast.error(
            response.data?.message ||
              "Failed to delete ad area category!"
          );
        }
      } catch (error) {
        console.error(
          "Error deleting ad area category:",
          error
        );
        toast.error("Error deleting ad area category!");
      } finally {
        set({ loadingDelete: false });
      }
    },
  })
);
