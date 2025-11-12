"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectStore } from "@/store/use-project-store";
import { projectColumns } from "@/data/table-column";
import { DynamicGrid } from "@/components/ui/dynamic-grid";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { DynamicTableSkeleton } from "@/components/skeleton/dynamic-table-skeleton";
import { AdGridSkeleton } from "@/components/skeleton/ad-grid-skeleton"; 

const Page = () => {
  const router = useRouter();
  const {
    projectList,
    loadingFetch,
    fetchProjectList,
    deleteProject,
    changeStatus,
  } = useProjectStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/project/form/${row.hash_id}`);
  };

  const handleDelete = async (row: any) => {
    await deleteProject(row.proj_id);
  };

  const handleChangeStatus = async (row: any) => {
    await changeStatus(row.hash_id);
  };

  if (loadingFetch) return <AdGridSkeleton />;

  if (!projectList.length)
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-center text-gray-400">No projects found.</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <section>
        <Breadcrumb pageName="Projects" createPath="/dashboard/project/form/0" viewMode={viewMode} isIcon={true} setViewMode={setViewMode} />

        {/* Content Section */}
        <Suspense
          fallback={
            viewMode === "grid" ? (
              <AdGridSkeleton />
            ) : (
              <DynamicTableSkeleton columns={projectColumns} />
            )
          }
        >
          {viewMode === "grid" ? (
            <DynamicGrid
              isContain={true}
              data={projectList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleChangeStatus}
              onView={(row) => router.push(`/dashboard/project/view/${row.hash_id}`)}
              />
            ) : (
              <DynamicTable
              isContain={true}
              columns={projectColumns}
              data={projectList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
              onView={(row) => router.push(`/dashboard/project/view/${row.hash_id}`)}
            />
          )}
        </Suspense>
      </section>
    </AdminLayout>
  );
};

export default Page;
