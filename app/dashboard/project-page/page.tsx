"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { projectPageColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";

import { useProjectPageStore } from "@/store/use-project-page-store";
import { useProjectStore } from "@/store/use-project-store";

const Page = () => {
  const router = useRouter();

  const {
    projectPageList,
    loadingFetch,
    fetchProjectPageList,
    deleteProjectPage,
    changeStatus,
  } = useProjectPageStore();

  const { projectList, fetchProjectList } = useProjectStore();

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Fetch data
  useEffect(() => {
    fetchProjectPageList();
    fetchProjectList();
  }, [fetchProjectPageList]);

  // Apply filter when list changes
  useEffect(() => {
    applyFilter(filters);
  }, [projectPageList]);

  // FILTER FUNCTION
  const applyFilter = (filters: Record<string, any>) => {
    let result = [...projectPageList];

    // Project filter
    if (filters.project && filters.project !== "all") {
      result = result.filter(
        (item) => String(item.page_proj_id) === String(filters.project)

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

  const handleEdit = (row: any) => {
    router.push(`/dashboard/project-page/form/${row.hash_id}`);
  };

  const handleDelete = async (row: any) => {
    await deleteProjectPage(row.hash_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  // Project filter options
  const projectFilterOptions = useMemo(() => {
    const options = projectList.map((project) => ({
      label: project.proj_name,
      value: String(project.proj_id),
    }));

    return [
      { label: "All Projects", value: "all" },
      ...options,
    ];
  }, [projectList]);

  // Final table data
  const finalTableData =
    filteredData.length > 0 || Object.keys(filters).length > 0
      ? filteredData
      : projectPageList;

  return (
    <AdminLayout>
      <section>
        <Breadcrumb
          pageName="Project Pages"
          createPath="/dashboard/project-page/form/0"
          filterConfig={[
            {
              name: "project",
              type: "select",
              placeholder: "Select Project",
              options: projectFilterOptions,
            },
            {
              name: "search",
              type: "text",
              placeholder: "Search...",
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            applyFilter(newFilters);
          }}
        />

        <Suspense fallback={<DynamicTableSkeleton columns={projectPageColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={projectPageColumns} />
          ) : (
            <DynamicTable
              columns={projectPageColumns}
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