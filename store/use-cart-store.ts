import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  hash_id: string;
  project_page_name: string;
  setg_ad_position: string;
  setg_ad_desc: string;
  setg_ad_size: string;
  setg_ad_charges: number | string;
  file_url?: string;
}

interface CartStore {
  cart: CartItem[];
  hydrated: boolean; 
  addToCart: (item: CartItem) => void;
  removeFromCart: (hash_id: string) => void;
  clearCart: () => void;
  setHydrated: (val: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      hydrated: false,

      addToCart: (item) => {
        const exists = get().cart.some((i) => i.hash_id === item.hash_id);
        if (exists) return;
        set({ cart: [...get().cart, item] });
      },

      removeFromCart: (hash_id) => {
        set({ cart: get().cart.filter((item) => item.hash_id !== hash_id) });
      },

      clearCart: () => set({ cart: [] }),

      setHydrated: (val) => set({ hydrated: val }),
    }),
    {
      name: "user-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
