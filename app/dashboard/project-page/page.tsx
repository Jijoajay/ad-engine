"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { projectPageColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { projectPageList, loading, fetchProjectPageList } = useProjectPageStore();

  useEffect(() => {
    fetchProjectPageList();
  }, [fetchProjectPageList]);

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Project Pages"
          createPath="/dashboard/project-pages/add-project-page"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={projectPageColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={projectPageColumns} />
          ) : (
            <DynamicTable columns={projectPageColumns} data={projectPageList} />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
