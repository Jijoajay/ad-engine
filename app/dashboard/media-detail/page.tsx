"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { mediaDetailColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaDetailStore } from "@/store/use-media-detail-store";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const {
    mediaDetailList,
    loadingFetch,
    loadingDelete,
    loadingStatus,
    changeStatus,
    fetchMediaDetailList,
    deleteMediaDetail,
  } = useMediaDetailStore();

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

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Media Details"
          createPath="/dashboard/media-detail/form/0"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={mediaDetailColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={mediaDetailColumns} />
          ) : (
            <DynamicTable
              columns={mediaDetailColumns}
              data={mediaDetailList}
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
