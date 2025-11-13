"use client";

import { create } from "zustand";
import api from "@/lib/api"; 
import { toast } from "sonner";

interface MonthlyEarning {
  year: string;
  month_num: string;
  earning: number;
}

interface MonthlyAds {
  year: string;
  month_num: string;
  total_ads: number;
}

interface DashboardData {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_impressions: string;
  total_clicks: string;
  total_advertisements: number;
  total_earnings: string;
  total_earnings_last_one_year: MonthlyEarning[];
  ads_last_one_year: MonthlyAds[];
}

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/dashboard");
      if (res.data.status) {
        set({ data: res.data.data, loading: false });
      } else {
        set({ loading: false, error: res.data.message });
        toast.error(res.data.message);
      }
    } catch (err: any) {
      set({ loading: false, error: err.message });
      toast.error("Failed to fetch dashboard data");
    }
  },
}));
