"use client";

import { useRouter, useParams } from "next/navigation";
import { use, useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceStore } from "@/store/use-device-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import { Value } from "@radix-ui/react-select";

const DevicePage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();
  const { loadingSave, saveDevice, formData, fetchDeviceByHash } =
    useDeviceStore();

  // Fetch device list and set current form if editing
  useEffect(() => {
    if (slug_id !== "0") {
      fetchDeviceByHash(slug_id)
    }
  }, [slug_id, fetchDeviceByHash])

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveDevice(data, router);
  };

  const fields = useMemo(() => [
    {
      label: "Device UDID",
      name: "device_udid",
      type: "text",
      placeholder: "Enter device UDID",
      required: true,
      value: formData.device_udid || "",
    },
    {
      label: "Device Type",
      name: "device_dvty_id",
      type: "select",
      options: [
        { label: "Type 1", value: "1" },
        { label: "Type 2", value: "2" },
      ],
      placeholder: "Select device type",
      required: true,
      value: formData.device_dvty_id?.toString() || "",
    },
    {
      label: "Device Position",
      name: "device_position",
      type: "text",
      placeholder: "Enter device position",
      required: true,
      value: formData.device_position || "",
    },
  ], [formData]);

  useEffect(() => {
    formData
  }, [formData])

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
          <DynamicForm
            key={formData?.device_id || "new"}
            title={formData?.device_id ? "Edit Device" : "Add Device"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default DevicePage;
