"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export interface CartItem {
  cart_odr_id: number;
  cart_odr_user_id: number;
  cart_odr_setg_id: number;
  cart_odr_quantity: number;
  cart_odr_created_date: string;
  cart_odr_modified_date: string;
  cart_odr_status: number;
  setg_ad_size: string;
  setg_ad_position: string;
  setg_ad_desc: string;
  setg_ad_charges: number | string;
  hash_id?: string;
  project_page_name?: string;
  file_url?: string;
  total_charges: number | string;
  setg_view_count: number | string;
  setg_click_count: number | string;
}

interface CartStore {
  cart: CartItem[];
  loading: boolean;
  paymentLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (item: Partial<CartItem> & { setg_id: number }) => Promise<void>;
  updateQuantity: (cart_odr_id: number, newQty: number) => Promise<void>;
  removeFromCart: (cart_odr_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  makePayment: () => Promise<boolean>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  loading: false,
  paymentLoading: false,

  fetchCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user?.id) {
      toast.error("You must be logged in to fetch the cart!");
      return;
    }

    set({ loading: true });
    try {
      const response = await api.get("/cart-order-details");
      set({ cart: response.data.data || [] });
    } catch (error) {
      toast.error("Failed to fetch cart.");
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (item) => {
    const user = useAuthStore.getState().user;
    if (!user?.id) {
      toast.error("You must be logged in to add items to cart!");
      return;
    }

    set({ loading: true });
    try {
      const existing = get().cart.find((i) => i.cart_odr_setg_id === item.setg_id);
      const newQuantity = existing ? existing.cart_odr_quantity + 1 : 1;

      await api.post("/cart-order-details/create-or-update", {
        cart_odr_id: existing?.cart_odr_id || "",
        cart_odr_user_id: user.id,
        cart_odr_setg_id: item.setg_id,
        cart_odr_quantity: newQuantity,
      });

      await get().fetchCart();
      toast.success("Item added to cart");
    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      toast.error("Failed to add item to cart.");
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (cart_odr_id, newQty) => {
    const user = useAuthStore.getState().user;
    if (!user?.id) {
      toast.error("You must be logged in to update cart!");
      return;
    }

    try {
      await api.post("/cart-order-details/create-or-update", {
        cart_odr_id,
        cart_odr_user_id: user.id,
        cart_odr_quantity: newQty,
      });

      set({
        cart: get().cart.map((i) =>
          i.cart_odr_id === cart_odr_id ? { ...i, cart_odr_quantity: newQty } : i
        ),
      });
      toast.success("Cart updated");
    } catch (error) {
      console.error("❌ Failed to update quantity:", error);
      toast.error("Failed to update quantity.");
    }
  },

  removeFromCart: async (cart_odr_id) => {
    try {
      await api.delete("/cart-order-details/delete", { data: { cart_odr_id } });
      set({ cart: get().cart.filter((i) => i.cart_odr_id !== cart_odr_id) });
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("❌ Failed to delete item:", error);
      toast.error("Failed to remove item.");
    }
  },

  clearCart: async () => {
    const cartIds = get().cart.map((i) => i.cart_odr_id);
    if (cartIds.length === 0) return;

    try {
      await api.put("/cart-order-details/clear", { cart_id: cartIds });
      set({ cart: [] });
    } catch (error) {
      console.error("❌ Failed to clear cart:", error);
      toast.error("Failed to clear cart.");
    }
  },

  makePayment: async () => {
    set({ paymentLoading: true });

    try {
      const cart = get().cart;
      if (!cart.length) {
        toast.error("Cart is empty!");
        return false;
      }

      const payload = {
        total_amount: cart.reduce(
          (acc, item) => acc + Number(item.setg_ad_charges || 0) * (item.cart_odr_quantity || 1),
          0
        ),
        order_details: cart.map((item) => ({
          advt_setg_id: item.cart_odr_setg_id,
          advt_view_count: item.setg_view_count || 0,
          advt_click_count: item.setg_click_count || 0,
          advt_charges:
            Number(item.setg_ad_charges || 0) * (item.cart_odr_quantity || 1),
        })),
      };

      await api.post("/make-payment", payload);
      await get().clearCart();
      toast.success("Payment successful");
      return true;
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed ❌");
      return false;
    } finally {
      set({ paymentLoading: false });
    }
  },
}));
