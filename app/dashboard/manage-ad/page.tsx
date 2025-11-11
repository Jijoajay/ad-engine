"use client";

import { useEffect, useState, Suspense } from "react";
import { useAdStore } from "@/store/use-ad-store";
import { AdGridSkeleton } from "@/components/skeleton/ad-grid-skeleton";
import { DynamicGrid } from "@/components/ui/dynamic-grid";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adColumns } from "@/data/table-column";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import AdminLayout from "@/layout/AdminLayout";
import { LayoutGrid, List } from "lucide-react"; // for icons
import { Button } from "@/components/ui/button";

const Page = () => {
  const { adminAdvertisements, deleteAd, fetchAllAdminAd, toggleAdStatus, loading } =
    useAdStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchAllAdminAd();
  }, [fetchAllAdminAd]);

  const handleDelete = async (ad: any) => {
    await deleteAd(ad.hash_id);
  };

  const handleToggle = async (ad: any) => {
    await toggleAdStatus(ad.hash_id);
  };

  if (loading) return <AdGridSkeleton />;

  if (!adminAdvertisements.length)
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-center text-gray-400">No advertisements found.</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <section>
        <Breadcrumb pageName="Manage Ads" createPath="/dashboard/ad-upload" isIcon={true} viewMode={viewMode} setViewMode={setViewMode}/>

        <Suspense
          fallback={
            viewMode === "grid" ? (
              <AdGridSkeleton />
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
            <DynamicTable
              columns={adColumns}
              data={adminAdvertisements}
              onDelete={handleDelete}
              onChangeStatus={handleToggle}
            />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
