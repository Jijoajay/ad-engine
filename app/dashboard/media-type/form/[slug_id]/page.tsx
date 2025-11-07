"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const MediaTypePage = () => {
  const router = useRouter();
  const { hash_id } = useParams<{ hash_id: string }>();

  const {
    formData,
    loadingSave,
    fetchMediaTypeList,
    setFormByHash,
    saveMediaType,
  } = useMediaTypeStore();

  // Fetch media type list and set current form if editing
  useEffect(() => {
    fetchMediaTypeList().then(() => {
      if (hash_id && setFormByHash) setFormByHash(hash_id);
    });
  }, [fetchMediaTypeList, setFormByHash, hash_id]);

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
