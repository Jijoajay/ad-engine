"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceTypeStore } from "@/store/use-device-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const DeviceTypePage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    formLoading,
    saveDeviceType,
    setFormBySlug,
    resetForm,
  } = useDeviceTypeStore();

  // Fetch form data on mount if editing, cleanup on unmount
  useEffect(() => {
    if (slug_id !== "0") {
      setFormBySlug(slug_id);
    }

    return () => {
      resetForm();
    };
  }, [slug_id, setFormBySlug, resetForm]);

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveDeviceType(data, router);
  };

  // Define fields dynamically
  const fields = useMemo(() => {
    return [
      {
        label: "Device Type Name",
        name: "dvty_name",
        type: "text",
        placeholder: "Enter device type name",
        required: true,
        value: formData.dvty_name || "",
        className: "col-span-1",
      },
      {
        label: "Description",
        name: "dvty_desc",
        type: "textarea",
        placeholder: "Enter description",
        required: true,
        value: formData.dvty_desc || "",
        className: "col-span-1",
      },
    ];
  }, [formData]);

  // Show skeleton while loading
  if (formLoading && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading Device Type..." fieldCount={2} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-black w-full max-w-3xl">
          <DynamicForm
            title={formData.dvty_id ? "Edit Device Type" : "Create Device Type"}
            fields={fields}
            loading={formLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default DeviceTypePage;
