"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { useAdLocationStore } from "@/store/use-ad-location-store";
import { useAdAreaCategoryStore } from "@/store/use-ad-area-category-store";
import { DynamicForm } from "@/components/ui/dynamic-form";
import BackButton from "@/components/ui/back-button";
import { DynamicFormSkeleton } from "@/components/skeleton/dynamic-form-skeleton";

const AdLocationPage = () => {
  const router = useRouter();
  const { slug_id } = useParams<{ slug_id: string }>();

  const {
    formData,
    loadingSave,
    loadingFetch,
    saveAdLocation,
    fetchAdLocationByHash,
    fetchAdLocationList,
    resetForm,
  } = useAdLocationStore();

  const {
    adAreaCategoryList,
    fetchAdAreaCategoryList,
  } = useAdAreaCategoryStore();


  useEffect(() => {
    fetchAdAreaCategoryList();
  }, [fetchAdAreaCategoryList]);


  useEffect(() => {
    fetchAdLocationList();
  }, [fetchAdLocationList]);

  useEffect(() => {
    if (slug_id !== "0") {
      fetchAdLocationByHash(slug_id);
    }
    return () => resetForm();
  }, [slug_id, fetchAdLocationByHash, resetForm]);


  const handleSubmit = (data: Record<string, any>) => {
    saveAdLocation(data, router);
  };


  const categoryOptions = useMemo(() => {
    return adAreaCategoryList.map((item) => ({
      label: item.adac_name,
      value: item.adac_id.toString(),
    }));
  }, [adAreaCategoryList]);


  const fields = useMemo(() => {
    return [
      {
        label: "Ad Area Category",
        name: "adlc_adac_id",
        type: "select",
        options: categoryOptions,
        placeholder: "Select category",
        required: true,
        value: formData.adlc_adac_id?.toString() || "",
        className: "col-span-1",
      },
      {
        label: "Location Name",
        name: "adlc_name",
        type: "text",
        placeholder: "Enter location name",
        required: true,
        value: formData.adlc_name || "",
        className: "col-span-1",
      },
      {
        label: "Short Code",
        name: "adlc_short_code",
        type: "text",
        placeholder: "Enter short code",
        required: true,
        value: formData.adlc_short_code || "",
        className: "col-span-1",
      },
    ];
  }, [formData, categoryOptions]);

  if (loadingFetch && slug_id !== "0") {
    return (
      <DynamicFormSkeleton
        title="Loading Ad Location..."
        fieldCount={3}
      />
    );
  }

  return (
    <AdminLayout>
      <BackButton />
      <section className="flex items-center justify-center">
        <div className="mt-6 bg-[#222327] w-full max-w-3xl">
          <DynamicForm
            title={
              formData.adlc_id
                ? "Edit Ad Location"
                : "Add Ad Location"
            }
            fields={fields}
            loading={loadingSave}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdLocationPage;
