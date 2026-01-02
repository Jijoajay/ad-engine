"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adLocationColums } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useAdLocationStore } from "@/store/use-ad-location-store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter();

  const {
    adLocationList,
    loadingFetch,
    loadingDelete,
    loadingStatus,
    fetchAdLocationList,
    deleteAdLocation,
    changeStatus,
  } = useAdLocationStore();


  useEffect(() => {
    fetchAdLocationList();
  }, [fetchAdLocationList]);


  const handleEdit = (row: any) => {
    router.push(`/dashboard/ad-location/form/${row.hash_id}`);
  };

  const handleDelete = async (row: any) => {
    await deleteAdLocation(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Ad Location"
          createPath="/dashboard/ad-location/form/0"
        />

        <Suspense
          fallback={
            <DynamicTableSkeleton columns={adLocationColums} />
          }
        >
          {loadingFetch ? (
            <DynamicTableSkeleton columns={adLocationColums} />
          ) : (
            <DynamicTable
              columns={adLocationColums}
              data={adLocationList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
              // Optional if your table supports it
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
