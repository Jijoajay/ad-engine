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
    loading,
  } = useAdStore();

  return (
    <MainLayout>
      <UploadContent
        isAdmin={true}
        projectList={projectList}
        pagesByProject={pagesByProject}
        adPositionsByPage={adPositionsByPage}
        advertisements={advertisements}
        fetchAdData={fetchAdData}
        saveAd={saveAd}
        loading={loading}
      />
    </MainLayout>
  );
};

export default Page;
