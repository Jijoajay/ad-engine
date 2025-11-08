"use client";

import { UploadContent } from "@/components/upload-content";
import AdminLayout from "@/layout/AdminLayout";
import { useEffect } from "react";
import { useProjectStore } from "@/store/use-project-store";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useAdSettingStore } from "@/store/use-ad-setting-store";
import { useAdStore } from "@/store/use-ad-store";

const AdminPage = () => {
  const { projectList, fetchProjectList } = useProjectStore();

  const { projectPageList, fetchProjectPageList } = useProjectPageStore();
  const { saveAd } = useAdStore();
  

  const {
    adSettingList,
    fetchAdSettingList,
  } = useAdSettingStore();

  useEffect(() => {
    fetchProjectList();
    fetchProjectPageList();
    fetchAdSettingList();
  }, [fetchProjectList, fetchProjectPageList, fetchAdSettingList]);

  const pagesByProject = projectPageList.reduce((acc: any, page) => {
    if (!acc[page.page_proj_id]) acc[page.page_proj_id] = [];
    acc[page.page_proj_id].push(page);
    return acc;
  }, {});

  const adPositionsByPage = adSettingList.reduce((acc: any, setting) => {
    if (!acc[setting.setg_page_id]) acc[setting.setg_page_id] = [];
    acc[setting.setg_page_id].push(setting);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <UploadContent
        isAdmin={true}
        projectList={projectList}
        pagesByProject={pagesByProject}
        adPositionsByPage={adPositionsByPage}
        advertisements={[]} 
        fetchAdData={fetchAdSettingList} 
        saveAd={saveAd}
        loading={false}
      />
    </AdminLayout>
  );
};

export default AdminPage;
