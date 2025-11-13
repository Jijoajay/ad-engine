"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectStore } from "@/store/use-project-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { ProjectFormSkeleton } from "@/components/skeleton/project-form-skeleton";

const Page = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();
  const {
    formData,
    loadingSave,
    loadingFetch,
    saveProject,
    fetchProjectByHash,
  } = useProjectStore();

 useEffect(() => {
  if (slug_id !== "0") {
    fetchProjectByHash(slug_id);
  }

  return () => {
    useProjectStore.getState().resetForm();
  };
}, [slug_id, fetchProjectByHash]);

  const handleSubmit = (data: Record<string, any>) => {
    saveProject(data, router);
  };

  const fields = useMemo(() => {
    return [
      {
        label: "Project Name",
        name: "proj_name",
        type: "text",
        placeholder: "Enter project name",
        required: true,
        value: formData.proj_name,
        className: "col-span-2",
      },
      {
        label: "Description",
        name: "proj_desc",
        type: "textarea",
        placeholder: "Enter project description",
        required: true,
        value: formData.proj_desc,
        className: "col-span-2",
      },
      {
        label: "File Upload",
        name: "file",
        type: "file",
        required: formData.proj_id ? false : true,
        value: formData.file,
        className: "col-span-2",
        isContain: true,
      },
    ];
  }, [formData]);


  if (loadingFetch && slug_id !== "0") {
    return <ProjectFormSkeleton />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-black w-full max-w-3xl">
          <DynamicForm
            title={formData.proj_id ? "Edit Project" : "Create Project"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default Page;
