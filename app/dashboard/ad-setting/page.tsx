"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adSettingColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useAdSettingStore } from "@/store/use-ad-setting-store";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const {
    adSettingList,
    loadingFetch,
    fetchAdSettingList,
    deleteAdSetting,
    changeStatus,
  } = useAdSettingStore();

  useEffect(() => {
    fetchAdSettingList();
  }, [fetchAdSettingList]);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/ad-setting/form/${row.hash_id}`)
  };

  const handleDelete = async (row: any) => {
    await deleteAdSetting(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Ad Settings"
          createPath="/dashboard/ad-setting/form/0"
        />
        <Suspense fallback={<DynamicTableSkeleton columns={adSettingColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={adSettingColumns} />
          ) : (
            <DynamicTable
              columns={adSettingColumns}
              data={adSettingList}
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
