"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const MediaTypePage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();
  const {
    formData,
    loadingSave,
    loadingFetch,
    setFormByHash,
    saveMediaType,
    resetForm,
  } = useMediaTypeStore();

  // Fetch media type if editing, and reset form on unmount
  useEffect(() => {
    if (slug_id !== "0") {
      setFormByHash(slug_id);
    }

    return () => {
      resetForm();
    };
  }, [slug_id, setFormByHash, resetForm]);

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveMediaType(data, router);
  };

  // Define form fields dynamically
  const fields = useMemo(() => {
    return [
      {
        label: "Media Type Name",
        name: "mdty_name",
        type: "text",
        placeholder: "Enter media type name",
        required: true,
        value: formData?.mdty_name || "",
        className: "col-span-1",
      },
    ];
  }, [formData]);

  // Show skeleton if loading fetch
  if (loadingFetch && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading Media Type..." fieldCount={1} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-[#222327] w-full max-w-3xl">
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
