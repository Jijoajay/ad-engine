"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { targetTypeColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useTargetTypeStore } from "@/store/use-target-type-store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const {
    targetTypeList,
    loadingFetch,
    loadingDelete,
    loadingStatus,
    fetchTargetTypeList,
    deleteTargetType,
    changeStatus,
  } = useTargetTypeStore();

  useEffect(() => {
    fetchTargetTypeList();
  }, [fetchTargetTypeList]);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/target-type/form/${row.hash_id}`)
  };

  const handleDelete = async (row: any) => {
    await deleteTargetType(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Target Types"
          createPath="/dashboard/target-type/form/0"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={targetTypeColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={targetTypeColumns} />
          ) : (
            <DynamicTable
              columns={targetTypeColumns}
              data={targetTypeList}
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
