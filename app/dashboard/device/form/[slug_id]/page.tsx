"use client";

import { useRouter, useParams } from "next/navigation";
import { use, useEffect } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceStore } from "@/store/use-device-store";
import { DynamicForm } from "@/components/ui/dynamic-form";

const DevicePage = () => {
  const router = useRouter();
  const { hash_id } = useParams<{ hash_id: string }>();
  const { deviceList, loadingSave, fetchDeviceList, setFormByHash, saveDevice, formData } =
    useDeviceStore();

  // Fetch device list and set current form if editing
  useEffect(() => {
    fetchDeviceList().then(() => {
      if (hash_id && setFormByHash) setFormByHash(hash_id);
    });
  }, [fetchDeviceList, setFormByHash, hash_id]);

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveDevice(data, router);
  };

  const fields = [
    {
      label: "Device UDID",
      name: "device_udid",
      type: "text",
      placeholder: "Enter device UDID",
      required: true,
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
    },
    {
      label: "Device Position",
      name: "device_position",
      type: "text",
      placeholder: "Enter device position",
      required: true,
    },
  ];

  useEffect(()=>{
    formData
  },[formData])

  return (
    <AdminLayout>
      <section>
        <div className="mt-6 bg-black">
          <DynamicForm
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
