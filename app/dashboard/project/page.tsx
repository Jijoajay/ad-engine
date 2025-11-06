"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { projectColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectStore } from "@/store/use-project-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { projectList, loading, fetchProjectList } = useProjectStore();

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  return (
    <AdminLayout>
      <section>
        <Breadcrumb pageName="Projects" createPath="/dashboard/projects/add-project" />
        <Suspense fallback={<DynamicTableSkeleton columns={projectColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={projectColumns} />
          ) : (
            <DynamicTable columns={projectColumns} data={projectList} />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
