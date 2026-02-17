"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

import { useAdSettingStore } from "@/store/use-ad-setting-store";
import { useProjectStore } from "@/store/use-project-store";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useTargetTypeStore } from "@/store/use-target-type-store";
import { useDeviceTypeStore } from "@/store/use-device-type-store";
import { useMediaDetailStore } from "@/store/use-media-detail-store";

const AdSettingPage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    loadingSave,
    loadingFetch,
    formData,
    fetchAdSettingByHashId,
    fetchAdSettingList,
    saveAdSetting,
    resetForm,
  } = useAdSettingStore();

  const { projectList, fetchProjectList } = useProjectStore();
  const { projectPageList, fetchProjectPageList, loadingHash } = useProjectPageStore();
  const { targetTypeList, fetchTargetTypeList } = useTargetTypeStore();
  const { fetchDeviceTypeList, deviceTypeList, loading: deviceTypeLoading } = useDeviceTypeStore();
  const { fetchMediaDetailList, mediaDetailList, loadingFetch: mediaDetailLoading } = useMediaDetailStore();

  // Fetch all lists
  useEffect(() => {
    fetchProjectList();
    fetchTargetTypeList();
    fetchProjectPageList();
    fetchDeviceTypeList();
    fetchAdSettingList();
    fetchMediaDetailList();
  }, [fetchProjectList, fetchTargetTypeList, fetchProjectPageList, fetchDeviceTypeList, fetchAdSettingList, fetchMediaDetailList]);

  console.log("mediaDetailList", mediaDetailList)

  // Fetch single record if editing & reset on unmount
  useEffect(() => {
    if (slug_id !== "0") {
      fetchAdSettingByHashId(slug_id);
    }
    return () => resetForm();
  }, [slug_id, fetchAdSettingByHashId, resetForm]);

  const projectOptions = useMemo(
    () => projectList.map((p) => ({ label: p.proj_name, value: String(p.proj_id) })),
    [projectList]
  );

  const pageOptions = useMemo(
    () => loadingHash ? [{ label: "Loading pages...", value: "" }] : projectPageList.map((p) => ({ label: p.page_name, value: String(p.page_id) })),
    [projectPageList, loadingHash]
  );

  const targetTypeOptions = useMemo(
    () => targetTypeList.map((t) => ({ label: t.trgt_name, value: String(t.trgt_id) })),
    [targetTypeList]
  );

  const deviceTypeOptions = useMemo(
    () => deviceTypeList.map((d) => ({ label: d.dvty_name, value: String(d.dvty_id) })),
    [deviceTypeList]
  );

  const mediaDetailsOptions = useMemo(
    () => mediaDetailList.map((d) => ({ label: d.mddt_desc, value: String(d.mddt_id) })),
    [deviceTypeList]
  );

  const handleSubmit = (data: Record<string, any>) => {
    saveAdSetting(data, router);
  };

  const fields = useMemo(() => [
    { label: "Project", name: "setg_proj_id", type: "select", options: projectOptions, placeholder: "Select project", required: true, value: formData.setg_proj_id.toString() },
    { label: "Page", name: "setg_page_id", type: "select", options: pageOptions, placeholder: "Select page", required: true, value: formData.setg_page_id?.toString() || "" },
    { label: "Target Type", name: "setg_trgt_id", type: "select", options: targetTypeOptions, placeholder: "Select target type", required: true, value: formData.setg_trgt_id?.toString() || "" },
    { label: "Device Type", name: "setg_dvty_id", type: "select", options: deviceTypeLoading ? [{ label: "Loading device types...", value: "" }] : deviceTypeOptions, placeholder: "Select device type", required: true, value: formData.setg_dvty_id?.toString() || "" },
    { label: "Media Details", name: "setg_mddt_id", type: "select", options: mediaDetailLoading ? [{ label: "Loading media details...", value: "" }] : mediaDetailsOptions, placeholder: "Select media detail", required: true, value: formData.setg_mddt_id?.toString() || "" },
    { label: "Ad Position", name: "setg_ad_position", type: "text", placeholder: "Enter ad position", required: true, value: formData.setg_ad_position || "" },
    { label: "Ad Size", name: "setg_ad_size", type: "text", placeholder: "e.g. 10 X 10", required: true, value: formData.setg_ad_size || "" },
    { label: "View Count", name: "setg_view_count", type: "number", placeholder: "Enter view count", required: true, value: formData.setg_view_count || 0 },
    { label: "Click Count", name: "setg_click_count", type: "number", placeholder: "Enter click count", required: true, value: formData.setg_click_count || 0 },
    { label: "Ad Charges ($)", name: "setg_ad_charges", type: "number", placeholder: "Enter ad charges", required: true, value: formData.setg_ad_charges || 0 },
    { label: "Ad Description", name: "setg_ad_desc", type: "textarea", placeholder: "Enter ad description", value: formData.setg_ad_desc || "" },
  ], [formData, projectOptions, pageOptions, targetTypeOptions, deviceTypeOptions, deviceTypeLoading]);

  if (loadingFetch && slug_id !== "0") {
    return <DynamicFormSkeleton title="Loading AD Setting..." fieldCount={fields.length} />;
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="mt-6 flex justify-center">
        <div className="w-full max-w-3xl">
          <DynamicForm
            title={formData.setg_id ? "Edit AD Setting" : "Add AD Setting"}
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdSettingPage;
