"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { deviceColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceStore } from "@/store/use-device-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const { deviceList, loading, fetchDeviceList } = useDeviceStore();

  useEffect(() => {
    fetchDeviceList();
  }, [fetchDeviceList]);

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Devices"
          createPath="/dashboard/devices/add-device"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={deviceColumns} />}>
          {loading ? (
            <DynamicTableSkeleton columns={deviceColumns} />
          ) : (
            <DynamicTable columns={deviceColumns} data={deviceList} />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
