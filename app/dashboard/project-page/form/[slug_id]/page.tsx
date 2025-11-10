"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useProjectStore } from "@/store/use-project-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const ProjectPageForm = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingSave,
    setFormByHash,
    saveProjectPage,
  } = useProjectPageStore();

  const { projectList, fetchProjectList } = useProjectStore();

  useEffect(() => {
    if (slug_id !== "0") {
      setFormByHash(slug_id)
    }
    fetchProjectList(); 
  }, [setFormByHash, slug_id, fetchProjectList]);

  const handleSubmit = (data: Record<string, any>) => {
    saveProjectPage(data, router);
  };

  // Map projects for dropdown options
  const projectOptions = projectList.map((proj) => ({
    label: proj.proj_name,
    value: String(proj.proj_id),
  }));

  const fields = [
    {
      label: "Project",
      name: "page_proj_id",
      type: "select",
      placeholder: "Select project",
      required: true,
      value: formData?.page_proj_id || "",
      options: projectOptions, 
    },
    {
      label: "Page Name",
      name: "page_name",
      type: "text",
      placeholder: "Enter page name",
      required: true,
      value: formData?.page_name || "",
    },
  ];

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
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
