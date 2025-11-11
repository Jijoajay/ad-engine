"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { DynamicGrid } from "@/components/ui/dynamic-grid";
import { mediaDetailColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaDetailStore } from "@/store/use-media-detail-store";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdGridSkeleton } from "@/components/skeleton/ad-grid-skeleton"; 

const Page = () => {
  const router = useRouter();
  const {
    mediaDetailList,
    loadingFetch,
    fetchMediaDetailList,
    deleteMediaDetail,
    changeStatus,
  } = useMediaDetailStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchMediaDetailList();
  }, [fetchMediaDetailList]);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/media-detail/form/${row.hash_id}`);
  };

  const handleDelete = async (row: any) => {
    await deleteMediaDetail(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  if (loadingFetch) return <AdGridSkeleton />;

  if (!mediaDetailList.length)
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-center text-gray-400">No media details found.</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Media Details"
          createPath="/dashboard/media-detail/form/0"
          viewMode={viewMode}
          isIcon={true}
          setViewMode={setViewMode}
        />

        <Suspense
          fallback={
            viewMode === "grid" ? (
              <AdGridSkeleton />
            ) : (
              <DynamicTableSkeleton columns={mediaDetailColumns} />
            )
          }
        >
          {viewMode === "grid" ? (
            <DynamicGrid
              data={mediaDetailList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleChangeStatus}
            />
          ) : (
            <DynamicTable
              columns={mediaDetailColumns}
              data={mediaDetailList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
            />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
