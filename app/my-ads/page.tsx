"use client";

import { useEffect, useState, Suspense } from "react";
import { useAdStore } from "@/store/use-ad-store";
import { AdGridSkeleton } from "@/components/skeleton/ad-grid-skeleton";
import { DynamicGrid } from "@/components/ui/dynamic-grid";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adColumns } from "@/data/table-column";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import MainLayout from "@/layout/MainLayout";

const Page = () => {
  const {
    adminAdvertisements,
    deleteAd,
    fetchAllUserAd,
    toggleAdStatus,
    loading,
  } = useAdStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchAllUserAd();
  }, [fetchAllUserAd]);

  const handleDelete = async (ad: any) => {
    await deleteAd(ad.hash_id);
  };

  const handleToggle = async (ad: any) => {
    await toggleAdStatus(ad.hash_id);
  };

  // ✅ Loading state
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

  // ✅ Empty state
  if (!adminAdvertisements.length)
    return (
      <MainLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 md:px-8">
          <p className="text-center text-gray-400 text-sm sm:text-base md:text-lg">
            No advertisements found.
          </p>
        </div>
      </MainLayout>
    );

  // ✅ Main content
  return (
    <MainLayout>
      <section className="pt-[100px] w-full flex items-center justify-center px-3 sm:px-6 md:px-8">
        <div className="w-full max-w-[1400px]">
          {/* Responsive toggle buttons (optional UI control) */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-md text-sm sm:text-base transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-md text-sm sm:text-base transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                List
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
                data={adminAdvertisements}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-800 bg-black">
                <DynamicTable
                  columns={adColumns}
                  data={adminAdvertisements}
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
