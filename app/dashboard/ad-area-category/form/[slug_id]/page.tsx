"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useAdAreaCategoryStore } from "@/store/use-ad-area-category-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const AdAreaCategoryPage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingSave,
    loadingFetch,
    saveAdAreaCategory,
    fetchAdAreaCategoryByHash,
    fetchAdAreaCategoryList,
    resetForm,
  } = useAdAreaCategoryStore();


  useEffect(() => {
    fetchAdAreaCategoryList();
  }, [fetchAdAreaCategoryList]);


  useEffect(() => {
    if (slug_id !== "0") {
      fetchAdAreaCategoryByHash(slug_id);
    }
    return () => resetForm();
  }, [slug_id, fetchAdAreaCategoryByHash, resetForm]);

 
  const handleSubmit = (data: Record<string, any>) => {
    saveAdAreaCategory(data, router);
  };

  const fields = useMemo(() => {
    return [
      {
        label: "Category Name",
        name: "adac_name",
        type: "text",
        placeholder: "Enter category name",
        required: true,
        value: formData.adac_name || "",
        className: "col-span-1",
      },
      {
        label: "Description",
        name: "adac_desc",
        type: "textarea",
        placeholder: "Enter category description",
        required: true,
        value: formData.adac_desc || "",
        className: "col-span-1",
      },
    ];
  }, [formData]);

  if (loadingFetch && slug_id !== "0") {
    return (
      <DynamicFormSkeleton
        title="Loading Ad Area Category..."
        fieldCount={2}
      />
    );
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-[#222327] w-full max-w-3xl">
          <DynamicForm
            title={
              formData.adac_id
                ? "Edit Ad Area Category"
                : "Add Ad Area Category"
            }
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdAreaCategoryPage;
