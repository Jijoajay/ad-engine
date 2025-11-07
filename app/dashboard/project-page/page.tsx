"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { projectPageColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const {
    projectPageList,
    loadingFetch,
    fetchProjectPageList,
    deleteProjectPage,
    changeStatus,
  } = useProjectPageStore();

  useEffect(() => {
    fetchProjectPageList();
  }, [fetchProjectPageList]);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/project-page/form/${row.hash_id}`);
  };

  const handleDelete = async (row: any) => {
    await deleteProjectPage(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Project Pages"
          createPath="/dashboard/project-page/form/0"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={projectPageColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={projectPageColumns} />
          ) : (
            <DynamicTable
              columns={projectPageColumns}
              data={projectPageList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
              // loadingDelete={loadingDelete}
              // loadingStatus={loadingStatus}
            />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
