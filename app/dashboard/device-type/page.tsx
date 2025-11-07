"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { deviceTypeColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceTypeStore } from "@/store/use-device-type-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { deviceTypeList, loading, fetchDeviceTypeList, deleteDeviceType } = useDeviceTypeStore();

  useEffect(() => {
    fetchDeviceTypeList();
  }, [fetchDeviceTypeList]);

  const handleEdit = (row: any) => {
    console.log("Edit row:", row);
    // e.g., navigate(`/dashboard/device-type/edit/${row.dvty_id}`)
  };

  const handleDelete = async (row: any) => {
    await deleteDeviceType(row.hash_id);
    fetchDeviceTypeList(); 
  };

  const handleChangeStatus = async (row: any, newStatus: number) => {
    // await updateDeviceStatus(row.dvty_id, newStatus);
    fetchDeviceTypeList(); 
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Device Types"
          createPath="/dashboard/device-type/add-device-type"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={deviceTypeColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={deviceTypeColumns} />
          ) : (
            <DynamicTable
              columns={deviceTypeColumns}
              data={deviceTypeList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
            />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
