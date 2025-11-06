"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceTypeStore } from "@/store/use-device-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const Page = () => {
  const router = useRouter();
  const { slug_name } = useParams<{ slug_name: string }>();
  const { formData, formLoading, fetchDeviceTypeList, saveDeviceType, setFormBySlug } =
    useDeviceTypeStore();

  useEffect(() => {
    fetchDeviceTypeList().then(() => setFormBySlug(slug_name));
  }, [fetchDeviceTypeList, setFormBySlug, slug_name]);

  const handleSubmit = (data: Record<string, any>) => {
    saveDeviceType(data, router);
  };

  const fields = [
    {
      label: "Device Type Name",
      name: "dvty_name",
      type: "text",
      placeholder: "Enter device type name",
      required: true,
    },
    {
      label: "Description",
      name: "dvty_desc",
      type: "textarea",
      placeholder: "Enter description",
      required: true,
    },
  ];

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
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

export default Page;
