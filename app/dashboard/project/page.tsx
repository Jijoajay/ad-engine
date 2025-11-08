"use client";

import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { projectColumns } from "@/data/table-column";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectStore } from "@/store/use-project-store";
import { Suspense, useEffect } from "react";

const Page = () => {
  const {
    projectList,
    loadingFetch,
    fetchProjectList,
    deleteProject,
    changeStatus,
  } = useProjectStore();

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  const handleEdit = (row: any) => {
    console.log("Edit row:", row);
    // e.g., navigate(`/dashboard/project/edit/${row.proj_id}`)
  };

  const handleDelete = async (row: any) => {
    await deleteProject(row.proj_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id,);
  };

  return (
    <AdminLayout>
      <section>
        <Breadcrumb pageName="Projects" createPath="/dashboard/project/add-project" />
        <Suspense fallback={<DynamicTableSkeleton columns={projectColumns} />}>
          {loadingFetch ? (
            <DynamicTableSkeleton columns={projectColumns} />
          ) : (
            <DynamicTable
              columns={projectColumns}
              data={projectList}
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
