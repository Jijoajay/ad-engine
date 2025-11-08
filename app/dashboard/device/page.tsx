"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { deviceColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceStore } from "@/store/use-device-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const {
    deviceList,
    loadingFetch,
    loadingDelete,
    loadingStatus,
    fetchDeviceList,
    deleteDevice,
    changeStatus,
    fetchDeviceByHash
  } = useDeviceStore();

  useEffect(() => {
    fetchDeviceList();
  }, [fetchDeviceList]);

  const handleEdit = (row: any) => {
    console.log("Edit device:", row);
    // e.g., navigate(`/dashboard/device/form/${row.hash_id}`)
  };

  useEffect(() => {
    const hashId = "MV8xNzYyNjA3OTMx"; // example hash_id
    fetchDeviceByHash(hashId);
  }, []);

  const handleDelete = async (row: any) => {
    await deleteDevice(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb pageName="Devices" createPath="/dashboard/device/form/0" />
        <Suspense fallback={<DynamicTableSkeleton columns={deviceColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={deviceColumns} />
          ) : (
            <DynamicTable
              columns={deviceColumns}
              data={deviceList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
            // you can pass loadingDelete and loadingStatus if your DynamicTable supports it
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
