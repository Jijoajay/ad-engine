"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { targetTypeColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useTargetTypeStore } from "@/store/use-target-type-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { targetTypeList, loading, fetchTargetTypeList } = useTargetTypeStore();

  useEffect(() => {
    fetchTargetTypeList();
  }, [fetchTargetTypeList]);

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Target Types"
          createPath="/dashboard/target-types/add-target-type"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={targetTypeColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={targetTypeColumns} />
          ) : (
            <DynamicTable columns={targetTypeColumns} data={targetTypeList} />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
