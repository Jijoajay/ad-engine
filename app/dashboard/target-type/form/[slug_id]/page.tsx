"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useTargetTypeStore } from "@/store/use-target-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const TargetTypeForm = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingSave,
    loadingFetch,
    fetchTargetTypeByHashId,
    saveTargetType,
    resetForm,
  } = useTargetTypeStore();

  // Fetch data if editing and reset on unmount
  useEffect(() => {
    if (slug_id !== "0") {
      fetchTargetTypeByHashId(slug_id);
    }

    return () => {
      resetForm();
    };
  }, [slug_id, fetchTargetTypeByHashId, resetForm]);

  const handleSubmit = (data: Record<string, any>) => {
    saveTargetType(data, router);
  };

  // Define fields dynamically
  const fields = useMemo(() => [
    {
      label: "Target Type Name",
      name: "trgt_name",
      type: "text",
      placeholder: "Enter target type name",
      required: true,
      value: formData?.trgt_name || "",
      className: "col-span-1",
    },
  ], [formData]);

  // Show skeleton if loading fetch
  if (loadingFetch && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading Target Type..." fieldCount={1} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-black w-full max-w-3xl">
          <DynamicForm
            title={formData?.trgt_id ? "Edit Target Type" : "Add Target Type"}
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
