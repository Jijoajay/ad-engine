"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const MediaTypePage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingSave,
    setFormByHash,
    saveMediaType,
  } = useMediaTypeStore();

    useEffect(()=>{
        if(slug_id !== "0" ){
          setFormByHash(slug_id)
        }
    },[slug_id])



  const handleSubmit = (data: Record<string, any>) => {
    saveMediaType(data, router);
  };

  const fields = [
    {
      label: "Media Type Name",
      name: "mdty_name",
      type: "text",
      placeholder: "Enter media type name",
      required: true,
      value: formData?.mdty_name || "",
    },
  ];

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
          <DynamicForm
            title={formData?.mdty_id ? "Edit Media Type" : "Add Media Type"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default MediaTypePage;
