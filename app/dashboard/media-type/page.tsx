"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { mediaTypeColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const {
    mediaTypeList,
    loadingFetch,
    loadingDelete,
    loadingStatus,
    fetchMediaTypeList,
    deleteMediaType,
    changeStatus,
  } = useMediaTypeStore();

  useEffect(() => {
    fetchMediaTypeList();
  }, [fetchMediaTypeList]);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/media-types/form/${row.hash_id}`);
  };

  const handleDelete = async (row: any) => {
    await deleteMediaType(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Media Types"
          createPath="/dashboard/media-type/form/0"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={mediaTypeColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={mediaTypeColumns} />
          ) : (
            <DynamicTable
              columns={mediaTypeColumns}
              data={mediaTypeList}
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
