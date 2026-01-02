"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adAreaCategoryColums } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useAdAreaCategoryStore } from "@/store/use-ad-area-category-store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter();

  const {
    adAreaCategoryList,
    loadingFetch,
    loadingDelete,
    loadingStatus,
    fetchAdAreaCategoryList,
    deleteAdAreaCategory,
    changeStatus,
  } = useAdAreaCategoryStore();


  useEffect(() => {
    fetchAdAreaCategoryList();
  }, [fetchAdAreaCategoryList]);


  const handleEdit = (row: any) => {
    router.push(
      `/dashboard/ad-area-category/form/${row.hash_id}`
    );
  };

  const handleDelete = async (row: any) => {
    await deleteAdAreaCategory(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };


  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Ad Area Category"
          createPath="/dashboard/ad-area-category/form/0"
        />

        <Suspense
          fallback={
            <DynamicTableSkeleton
              columns={adAreaCategoryColums}
            />
          }
        >
          {loadingFetch ? (
            <DynamicTableSkeleton
              columns={adAreaCategoryColums}
            />
          ) : (
            <DynamicTable
              columns={adAreaCategoryColums}
              data={adAreaCategoryList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
              // Optional if supported
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
