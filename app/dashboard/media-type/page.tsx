"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { mediaTypeColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { mediaTypeList, loading, fetchMediaTypeList } = useMediaTypeStore();

  useEffect(() => {
    fetchMediaTypeList();
  }, [fetchMediaTypeList]);

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Media Types"
          createPath="/dashboard/media-types/add-media-type"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={mediaTypeColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={mediaTypeColumns} />
          ) : (
            <DynamicTable columns={mediaTypeColumns} data={mediaTypeList} />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
