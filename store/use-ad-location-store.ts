import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// types

export interface AdLocation {
  adlc_id: number | "";
  adlc_adac_id: number;
  adlc_name: string;
  adlc_short_code: string;
  adlc_created_date?: string;
  adlc_modifie_date?: string | null;
  adlc_status?: number;
  hash_id?: string;
}

interface AdLocationState {
  adLocationList: AdLocation[];
  formData: Partial<AdLocation>;

  loadingFetch: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  loadingStatus: boolean;

  // Actions
  fetchAdLocationList: () => Promise<void>;
  fetchAdLocationByHash: (hash_id: string) => Promise<void>;
  setFormByHash: (hash_id: string) => void;

  saveAdLocation: (
    data: Partial<AdLocation>,
    router?: ReturnType<typeof useRouter>
  ) => Promise<AdLocation | null>;

  saveAdLocationAndReturn: (
    data: Partial<AdLocation>
  ) => Promise<AdLocation | null>;

  changeStatus: (hash_id: string) => Promise<void>;
  deleteAdLocation: (hash_id: string) => Promise<void>;
  resetForm: () => void;
}



export const useAdLocationStore = create<AdLocationState>((set, get) => ({
  adLocationList: [],
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

// fetch list
  fetchAdLocationList: async () => {
    set({ loadingFetch: true });
    try {
      const response = await api.get("/ad-locations");

      if (response.data?.status) {
        set({ adLocationList: response.data.data });
      } else {
        toast.error(response.data?.message || "Failed to load ad locations!");
      }
    } catch (error) {
      console.error("Error fetching ad locations:", error);
    } finally {
      set({ loadingFetch: false });
    }
  },

  setFormByHash: (hash_id: string) => {
    const adLocation = get().adLocationList.find(
      (item) => item.hash_id === hash_id
    );

    if (adLocation) {
      set({ formData: adLocation });
    } else {
      toast.error("Ad location not found!");
    }
  },

// fetch ad location by id
  fetchAdLocationByHash: async (hash_id: string) => {
    set({ loadingFetch: true });
    try {
      const response = await api.get(`/ad-location/${hash_id}`);

      if (response.data?.status && response.data?.data) {
        set({ formData: response.data.data });
      } else {
        toast.error(
          response.data?.message || "Failed to load ad location!"
        );
      }
    } catch (error) {
      console.error("Error fetching ad location:", error);
    } finally {
      set({ loadingFetch: false });
    }
  },


//   adlocation create and update
  saveAdLocation: async (data, router) => {
    const { formData } = get();
    set({ loadingSave: true });

    try {
      const payload = {
        adlc_id: formData.adlc_id || "",
        adlc_adac_id: data.adlc_adac_id ?? formData.adlc_adac_id,
        adlc_name: data.adlc_name ?? formData.adlc_name,
        adlc_short_code:
          data.adlc_short_code ?? formData.adlc_short_code,
      };

      const response = await api.post(
        "/ad-location/create-or-update",
        payload
      );

      if (response.data?.status) {
        toast.success("Ad location saved successfully!");
        await get().fetchAdLocationList();

        if (router) {
          router.push("/dashboard/ad-location");
        }

        return response.data.data as AdLocation;
      } else {
        toast.error(
          response.data?.message || "Failed to save ad location!"
        );
      }

      return null;
    } catch (error) {
      console.error("Error saving ad location:", error);
      toast.error("Error saving ad location!");
      return null;
    } finally {
      set({ loadingSave: false });
    }
  },

// 
  saveAdLocationAndReturn: async (data) => {
    const { formData } = get();

    try {
      const payload = {
        adlc_id: formData.adlc_id || "",
        adlc_adac_id: data.adlc_adac_id ?? formData.adlc_adac_id,
        adlc_name: data.adlc_name ?? formData.adlc_name,
        adlc_short_code:
          data.adlc_short_code ?? formData.adlc_short_code,
      };

      const response = await api.post(
        "/ad-location/create-or-update",
        payload
      );

      if (response.data?.status) {
        return response.data.data as AdLocation;
      }

      return null;
    } catch (error) {
      console.error("Error saving ad location:", error);
      return null;
    }
  },

// change status
  changeStatus: async (hash_id: string) => {
    set({ loadingStatus: true });
    try {
      const response = await api.put(
        "/ad-location/toggle-status",
        { adac_id: hash_id }
      );

      if (response.data?.status) {
        toast.success("Status updated successfully!");
        await get().fetchAdLocationList();
      } else {
        toast.error(
          response.data?.message || "Failed to update status!"
        );
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Error updating status!");
    } finally {
      set({ loadingStatus: false });
    }
  },


  deleteAdLocation: async (hash_id: string) => {
    set({ loadingDelete: true });
    try {
      const response = await api.delete(
        "/ad-location/delete",
        {
          data: { deletedId: hash_id },
        }
      );

      if (response.data?.status) {
        toast.success("Ad location deleted successfully!");
        await get().fetchAdLocationList();
      } else {
        toast.error(
          response.data?.message || "Failed to delete ad location!"
        );
      }
    } catch (error) {
      console.error("Error deleting ad location:", error);
      toast.error("Error deleting ad location!");
    } finally {
      set({ loadingDelete: false });
    }
  },
}));
