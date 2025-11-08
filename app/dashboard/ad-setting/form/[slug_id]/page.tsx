"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useAdSettingStore } from "@/store/use-ad-setting-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import { useProjectStore } from "@/store/use-project-store";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useTargetTypeStore } from "@/store/use-target-type-store";
import { useDeviceTypeStore } from "@/store/use-device-type-store";

const AdSettingPage = () => {
  const router = useRouter();
  const { hash_id } = useParams<{ hash_id: string }>();

  const { loadingSave, fetchAdSettingList, setFormByHash, saveAdSetting } =
    useAdSettingStore();

  const { projectList, fetchProjectList } = useProjectStore();
  const { projectPageList, fetchProjectPageList, loadingHash } =
    useProjectPageStore();
  const { targetTypeList, fetchTargetTypeList } = useTargetTypeStore();
  const {
    fetchDeviceTypeList,
    deviceTypeList,
    loading: deviceTypeLoading,
  } = useDeviceTypeStore();

  // 🧩 Fetch lists
  useEffect(() => {
    fetchProjectList();
    fetchTargetTypeList();
    fetchProjectPageList();
    fetchDeviceTypeList();
    fetchAdSettingList();
  }, [
    fetchProjectList,
    fetchTargetTypeList,
    fetchProjectPageList,
    fetchDeviceTypeList,
    fetchAdSettingList,
  ]);

  // 🧱 Set form when hash is present
  useEffect(() => {
    if (hash_id) setFormByHash(hash_id);
  }, [hash_id, setFormByHash]);

  // 🧾 Options for dropdowns
  const projectOptions = useMemo(
    () =>
      projectList.map((p) => ({
        label: p.proj_name,
        value: String(p.proj_id),
      })),
    [projectList]
  );

  const pageOptions = useMemo(
    () =>
      projectPageList.map((page) => ({
        label: page.page_name,
        value: String(page.page_id),
      })),
    [projectPageList]
  );

  const targetTypeOptions = useMemo(
    () =>
      targetTypeList.map((t) => ({
        label: t.trgt_name,
        value: String(t.trgt_id),
      })),
    [targetTypeList]
  );

  const deviceTypeOptions = useMemo(
    () =>
      deviceTypeList.map((d) => ({
        label: d.dvty_name,
        value: String(d.dvty_id),
      })),
    [deviceTypeList]
  );

  // 🟨 Handle form submit
  const handleSubmit = (data: Record<string, any>) => {
    saveAdSetting(data, router);
  };

  // 🧱 Dynamic Form Fields (complete)
  const fields = [
    {
      label: "Ad Setting ID",
      name: "setg_id",
      type: "hidden",
    },
    {
      label: "Project",
      name: "setg_proj_id",
      type: "select",
      options: projectOptions,
      placeholder: "Select project",
      required: true,
    },
    {
      label: "Page",
      name: "setg_page_id",
      type: "select",
      options: loadingHash
        ? [{ label: "Loading pages...", value: "" }]
        : pageOptions,
      placeholder: "Select page",
      required: true,
    },
    {
      label: "Target Type",
      name: "setg_trgt_id",
      type: "select",
      options: targetTypeOptions,
      placeholder: "Select target type",
      required: true,
    },
    {
      label: "Device Type",
      name: "setg_dvty_id",
      type: "select",
      options: deviceTypeLoading
        ? [{ label: "Loading device types...", value: "" }]
        : deviceTypeOptions,
      placeholder: "Select device type",
      required: true,
    },
    {
      label: "Media Type",
      name: "setg_mddt_id",
      type: "select",
      options: [
        { label: "Image", value: "1" },
        { label: "Video", value: "2" },
      ],
      placeholder: "Select media type",
      required: true,
    },
    {
      label: "Ad Position",
      name: "setg_ad_position",
      type: "text",
      placeholder: "Enter ad position",
      required: true,
    },
    {
      label: "Ad Description",
      name: "setg_ad_desc",
      type: "textarea",
      placeholder: "Enter ad description",
    },
    {
      label: "Ad Size",
      name: "setg_ad_size",
      type: "text",
      placeholder: "e.g. 10 X 10",
      required: true,
    },
    {
      label: "View Count",
      name: "setg_view_count",
      type: "number",
      placeholder: "Enter view count",
      required: true,
    },
    {
      label: "Click Count",
      name: "setg_click_count",
      type: "number",
      placeholder: "Enter click count",
      required: true,
    },
    {
      label: "Ad Charges ($)",
      name: "setg_ad_charges",
      type: "number",
      placeholder: "Enter ad charges",
      required: true,
    },
  ];

  return (
    <AdminLayout>
      <section className="mt-6">
        <DynamicForm
          title="Add Ad Setting"
          fields={fields}
          loading={loadingSave}
          onSubmit={handleSubmit}
        />
      </section>
    </AdminLayout>
  );
};

export default AdSettingPage;
