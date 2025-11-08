"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useTargetTypeStore } from "@/store/use-target-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const TargetTypeForm = () => {
  const router = useRouter();
  const { hash_id } = useParams<{ hash_id: string }>();

  const {
    formData,
    loadingSave,
    fetchTargetTypeList,
    setFormByHash,
    saveTargetType,
  } = useTargetTypeStore();

  // Fetch existing target types and set form if editing
  useEffect(() => {
    fetchTargetTypeList().then(() => {
      if (hash_id) setFormByHash(hash_id);
    });
  }, [fetchTargetTypeList, setFormByHash, hash_id]);

  const handleSubmit = (data: Record<string, any>) => {
    saveTargetType(data, router);
  };

  const fields = [
    {
      label: "Target Type Name",
      name: "trgt_name",
      type: "text",
      placeholder: "Enter target type name",
      required: true,
      value: formData?.trgt_name || "",
    },
  ];

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
          <DynamicForm
            title={formData.trgt_id ? "Edit Target Type" : "Add Target Type"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default TargetTypeForm;
