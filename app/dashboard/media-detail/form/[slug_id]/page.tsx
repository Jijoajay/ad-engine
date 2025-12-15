"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaDetailStore } from "@/store/use-media-detail-store";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const MediaDetailPage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingFetch,
    loadingSave,
    setFormByHash,
    saveMediaDetail,
    resetForm,
  } = useMediaDetailStore();

  const { mediaTypeList, fetchMediaTypeList } = useMediaTypeStore();

  const [mediaTypeOptions, setMediaTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Fetch data (media detail + media types)
  useEffect(() => {
    if (slug_id !== "0") {
      setFormByHash(slug_id);
    }

    fetchMediaTypeList();

    return () => {
      resetForm();
    };
  }, [slug_id, setFormByHash, fetchMediaTypeList, resetForm]);

  // Set dropdown options dynamically
  useEffect(() => {
    if (mediaTypeList?.length) {
      setMediaTypeOptions(
        mediaTypeList.map((type) => ({
          label: type.mdty_name,
          value: String(type.mdty_id),
        }))
      );
    }
  }, [mediaTypeList]);

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveMediaDetail(data, router);
  };

  // Define form fields dynamically
  const fields = useMemo(() => {
    return [
      {
        label: "Media Type",
        name: "mddt_mdty_id",
        type: "select",
        options: mediaTypeOptions,
        placeholder: "Select media type",
        required: true,
        value: formData?.mddt_mdty_id ? String(formData.mddt_mdty_id) : "",
        className: "col-span-1",
      },
      {
        label: "Description",
        name: "mddt_desc",
        type: "text",
        placeholder: "Enter description",
        required: false,
        value: formData?.mddt_desc || "",
        className: "col-span-1",
      },
      {
        label: "Media File",
        name: "file",
        type: "file",
        placeholder: "Upload media file",
        required: true,
        value: formData?.file || "",
        className: "col-span-2",
      },
    ];
  }, [formData, mediaTypeOptions]);

  // Show skeleton when loading existing record
  if (loadingFetch && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading Media Detail..." fieldCount={3} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-[#222327] w-full max-w-3xl">
          <DynamicForm
            title={formData?.mddt_id ? "Edit Media Detail" : "Add Media Detail"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default MediaDetailPage;
