"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useProjectStore } from "@/store/use-project-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const ProjectPageForm = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingSave,
    loadingFetch,
    setFormByHash,
    saveProjectPage,
    resetForm,
  } = useProjectPageStore();

  const { projectList, fetchProjectList } = useProjectStore();

  // Fetch page data if editing, fetch project list, reset on unmount
  useEffect(() => {
    if (slug_id !== "0") {
      setFormByHash(slug_id);
    }
    fetchProjectList();

    return () => {
      resetForm();
    };
  }, [slug_id, setFormByHash, fetchProjectList, resetForm]);

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveProjectPage(data, router);
  };

  // Map projects for select dropdown
  const projectOptions = useMemo(() => {
    return projectList.map((proj) => ({
      label: proj.proj_name,
      value: String(proj.proj_id),
    }));
  }, [projectList]);

  // Define form fields dynamically
  const fields = useMemo(() => {
    return [
      {
        label: "Project",
        name: "page_proj_id",
        type: "select",
        placeholder: "Select project",
        required: true,
        value: formData?.page_proj_id || "",
        options: projectOptions,
        className: "col-span-1",
      },
      {
        label: "Page Name",
        name: "page_name",
        type: "text",
        placeholder: "Enter page name",
        required: true,
        value: formData?.page_name || "",
        className: "col-span-1",
      },
    ];
  }, [formData, projectOptions]);

  // Show skeleton if loading fetch
  if (loadingFetch && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading Project Page..." fieldCount={2} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-black w-full max-w-3xl">
          <DynamicForm
            title={formData?.page_id ? "Edit Project Page" : "Add Project Page"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default ProjectPageForm;
