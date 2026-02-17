"use client";

import { useEffect, useState, Suspense } from "react";
import { useAdStore } from "@/store/use-ad-store";
import { AdGridSkeleton } from "@/components/skeleton/ad-grid-skeleton";
import { DynamicGrid } from "@/components/ui/dynamic-grid";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adColumns } from "@/data/table-column";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import MainLayout from "@/layout/MainLayout";
import { LayoutGrid, List } from "lucide-react";

const Page = () => {
  const {
    adminAdvertisements,
    deleteAd,
    fetchAllUserAd,
    toggleAdStatus,
    loading,
  } = useAdStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAdvertisements = adminAdvertisements.filter(
    (ad: any) => ad.advt_id !== null && ad.advt_id !== undefined && ad.advt_id !== ""
  );

  useEffect(() => {
    fetchAllUserAd();
  }, [fetchAllUserAd]);

  const handleDelete = async (ad: any) => {
    await deleteAd(ad.hash_id);
  };

  const handleToggle = async (ad: any) => {
    await toggleAdStatus(ad.hash_id);
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <section className="pt-[100px] w-full flex items-center justify-center px-4 sm:px-6 md:px-8">
          {viewMode === "grid" ? (
            <AdGridSkeleton isClient={true} />
          ) : (
            <DynamicTableSkeleton columns={adColumns} />
          )}
        </section>
      </MainLayout>
    );
  }

  // Empty state
  if (!filteredAdvertisements.length)
    return (
      <MainLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 md:px-8">
          <p className="text-center text-gray-400 text-sm sm:text-base md:text-lg">
            No advertisements found.
          </p>
        </div>
      </MainLayout>
    );

  // Main content
  return (
    <MainLayout>
      <section className="pt-[100px] pb-20 w-full flex items-center justify-center px-3 sm:px-6 md:px-8 min-h-screen">
        <div className="w-full max-w-[1400px]">
          {/* Responsive toggle buttons (optional UI control) */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-md text-sm sm:text-base transition-colors ${viewMode === "grid"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700"
                  }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-md text-sm sm:text-base transition-colors ${viewMode === "list"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700"
                  }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <Suspense
            fallback={
              viewMode === "grid" ? (
                <AdGridSkeleton isClient={true} />
              ) : (
                <DynamicTableSkeleton columns={adColumns} />
              )
            }
          >
            {viewMode === "grid" ? (
              <DynamicGrid
                isAds={true}
                data={filteredAdvertisements}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-800 bg-black p-4">
                <DynamicTable
                  isClientAds={true}
                  columns={adColumns}
                  data={filteredAdvertisements}
                  onDelete={handleDelete}
                  onChangeStatus={handleToggle}
                />
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </MainLayout>
  );
};

export default Page;
