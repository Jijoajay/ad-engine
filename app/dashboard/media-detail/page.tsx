"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { mediaDetailColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaDetailStore } from "@/store/use-media-detail-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { mediaDetailList, loading, fetchMediaDetailList } = useMediaDetailStore();

  useEffect(() => {
    fetchMediaDetailList();
  }, [fetchMediaDetailList]);

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Media Details"
          createPath="/dashboard/media-details/add-media-detail"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={mediaDetailColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={mediaDetailColumns} />
          ) : (
            <DynamicTable columns={mediaDetailColumns} data={mediaDetailList} />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
