"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/layout/AdminLayout";
import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { adSettingColumns } from "@/data/table-column";
import { useAdSettingStore } from "@/store/use-ad-setting-store";

const Page = () => {
  const router = useRouter();

  const {
    adSettingList,
    loadingFetch,
    fetchAdSettingList,
    deleteAdSetting,
    changeStatus,
  } = useAdSettingStore();

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchAdSettingList();
  }, [fetchAdSettingList]);

  // Re-apply filters whenever original list changes
  useEffect(() => {
    applyFilter(filters);
  }, [adSettingList]);

  // 🔥 FILTER FUNCTION
  const applyFilter = (filters: Record<string, any>) => {
    let result = [...adSettingList];

    // Category filter
    if (filters.category) {
      result = result.filter(
        (item) =>
          item.setg_ad_position?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Search filter
    if (filters.search) {
      const searchText = filters.search.toLowerCase();

      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText)
        )
      );
    }

    setFilteredData(result);
  };

  // Edit row
  const handleEdit = (row: any) => {
    router.push(`/dashboard/ad-setting/form/${row.hash_id}`);
  };

  // Delete row
  const handleDelete = async (row: any) => {
    await deleteAdSetting(row.hash_id);
  };

  // Toggle Status
  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  // Final data to show
  const finalTableData =
    filteredData.length > 0 || Object.keys(filters).length > 0
      ? filteredData
      : adSettingList;

  return (
    <AdminLayout>
      <section>
        {/* ⭐ Breadcrumb With Filters */}
        <Breadcrumb
          pageName="Ad Settings"
          createPath="/dashboard/ad-setting/form/0"
          filterConfig={[
            {
              name: "category",
              type: "select",
              placeholder: "Select Ad Position",
              options: [
                { label: "Electronics", value: "electronics" },
                { label: "Clothes", value: "clothes" },
              ],
            },
            {
              name: "search",
              type: "text",
              placeholder: "Search Ad Position...",
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            applyFilter(newFilters);
          }}
        />

        {/* ⭐ Table + Loader */}
        <Suspense fallback={<DynamicTableSkeleton columns={adSettingColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={adSettingColumns} />
          ) : (
            <DynamicTable
              columns={adSettingColumns}
              data={finalTableData}
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
