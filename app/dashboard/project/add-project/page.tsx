"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectStore } from "@/store/use-project-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const Page = () => {
  const router = useRouter();
  const { slug_name } = useParams<{ slug_name: string }>();
  const { formData, loadingSave, fetchProjectList, saveProject, setFormBySlug } =
    useProjectStore();

  useEffect(() => {
    fetchProjectList().then(() => setFormBySlug(slug_name));
  }, [fetchProjectList, setFormBySlug, slug_name]);

  const handleSubmit = (data: Record<string, any>) => {
    saveProject(data, router);
  };

  const fields = [
    {
      label: "Project Name",
      name: "proj_name",
      type: "text",
      placeholder: "Enter project name",
      required: true,
    },
    {
      label: "Description",
      name: "proj_desc",
      type: "textarea",
      placeholder: "Enter project description",
      required: true,
    },
    {
      label: "File Upload",
      name: "file",
      type: "file",
      required: formData.proj_id ? false : true,
    },
  ];

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
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
