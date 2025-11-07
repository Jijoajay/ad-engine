"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useMediaDetailStore } from "@/store/use-media-detail-store";
import { useMediaTypeStore } from "@/store/use-media-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const MediaDetailPage = () => {
  const router = useRouter();
  const { hash_id } = useParams<{ hash_id: string }>();

  const {
    formData,
    loadingSave,
    fetchMediaDetailList,
    setFormByHash,
    saveMediaDetail,
  } = useMediaDetailStore();

  const { mediaTypeList, fetchMediaTypeList } = useMediaTypeStore();

  const [mediaTypeOptions, setMediaTypeOptions] = useState<{ label: string; value: string }[]>([]);

  // Fetch media detail list and set current form if editing
  useEffect(() => {
    fetchMediaDetailList().then(() => {
      if (hash_id && setFormByHash) setFormByHash(hash_id);
    });

    fetchMediaTypeList();
  }, [fetchMediaDetailList, setFormByHash, fetchMediaTypeList, hash_id]);

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

  const handleSubmit = (data: Record<string, any>) => {
    saveMediaDetail(data, router);
  };

  const fields = [
    {
      label: "Media Type",
      name: "mddt_mdty_id",
      type: "select",
      options: mediaTypeOptions,
      placeholder: "Select media type",
      required: true,
      value: formData?.mddt_mdty_id ? String(formData.mddt_mdty_id) : "",
    },
    {
      label: "Description",
      name: "mddt_desc",
      type: "text",
      placeholder: "Enter description",
      required: false,
    },
    {
      label: "Media File",
      name: "file",
      type: "file",
      placeholder: "Upload media file",
      required: true,
    },
  ];

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
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
