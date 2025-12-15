"use client";

import MainLayout from "@/layout/MainLayout";
import { UploadContent } from "@/components/upload-content";
import { useAdStore } from "@/store/use-ad-store";


const Page = () => {

  const {
    projectList,
    pagesByProject,
    adPositionsByPage,
    advertisements,
    fetchAdData,
    saveAd,
    hasWebsiteAds, 
    hasDeviceAds,
    loading,
  } = useAdStore();

  return (
    <MainLayout>
      <UploadContent
        isAdmin={false}
        projectList={projectList}
        pagesByProject={pagesByProject}
        adPositionsByPage={adPositionsByPage}
        advertisements={advertisements}
        fetchAdData={fetchAdData}
        saveAd={saveAd}
        loading={loading}
        hasWebsiteAds={hasWebsiteAds}
        hasDeviceAds={hasDeviceAds}
      />
    </MainLayout>
  );
};

export default Page;
