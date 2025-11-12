"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useProjectStore } from "@/store/use-project-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const Page = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();
  const { formData, loadingSave, saveProject, fetchProjectByHash } = useProjectStore();

    useEffect(()=>{
        if(slug_id !== "0" ){
            fetchProjectByHash(slug_id)
        }
    },[slug_id, fetchProjectByHash])

  const handleSubmit = (data: Record<string, any>) => {
    saveProject(data, router);
  };

  console.log("formData", formData)

  const fields = [
    {
      label: "Project Name",
      name: "proj_name",
      type: "text",
      placeholder: "Enter project name",
      required: true,
      value:formData.proj_name
    },
    {
        label: "Description",
        name: "proj_desc",
        type: "textarea",
        placeholder: "Enter project description",
        required: true,
        value:formData.proj_desc
    },
    {
        label: "File Upload",
        name: "file",
        type: "file",
        required: formData.proj_id ? false : true,
        value:formData.file
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
