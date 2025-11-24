"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useDeviceStore } from "@/store/use-device-store";
import { useDeviceTypeStore } from "@/store/use-device-type-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const DevicePage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    deviceList,
    formData,
    loadingSave,
    loadingFetch,
    saveDevice,
    fetchDeviceByHash,
    fetchDeviceList,
    resetForm,
  } = useDeviceStore();

  const {
    deviceTypeList,
    fetchDeviceTypeList,
  } = useDeviceTypeStore();

  // Fetch all device types for the select
  useEffect(() => {
    fetchDeviceTypeList();
  }, [fetchDeviceTypeList]);

  // Fetch all devices if needed
  useEffect(() => {
    fetchDeviceList();
  }, [fetchDeviceList]);

  // Fetch device data if editing, and clean up on unmount
  useEffect(() => {
    if (slug_id !== "0") {
      fetchDeviceByHash(slug_id);
    }
    return () => resetForm();
  }, [slug_id, fetchDeviceByHash, resetForm]);

  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    saveDevice(data, router);
  };

  // Map deviceTypeList to select options
  const deviceTypeOptions = useMemo(() => {
    return deviceTypeList.map((type) => ({
      label: type.dvty_name,
      value: type.dvty_id.toString(),
    }));
  }, [deviceTypeList]);

  // Define form fields dynamically
  const fields = useMemo(() => {
    return [
      {
        label: "Device UDID",
        name: "device_udid",
        type: "text",
        placeholder: "Enter device UDID",
        required: true,
        value: formData.device_udid || "",
        className: "col-span-1",
      },
      {
        label: "Device Type",
        name: "device_dvty_id",
        type: "select",
        options: deviceTypeOptions,
        placeholder: "Select device type",
        required: true,
        value: formData.device_dvty_id?.toString() || "",
        className: "col-span-1",
      },
      {
        label: "Device Position",
        name: "device_position",
        type: "text",
        placeholder: "Enter device position",
        required: true,
        value: formData.device_position || "",
        className: "col-span-1",
      },
    ];
  }, [formData, deviceTypeOptions]);

  if (loadingFetch && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading Device..." fieldCount={3} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-black w-full max-w-3xl">
          <DynamicForm
            title={formData.device_id ? "Edit Device" : "Add Device"}
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
