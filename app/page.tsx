"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useProjectStore } from "@/store/use-project-store";
import { SkeletonCard } from "@/components/skeleton/card-skeleton";
import DeviceContent from "@/components/device-content";

export default function Home() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { projectList, fetchProjectList, loadingFetch } = useProjectStore();

  const [hydrated, setHydrated] = useState(false);

  // ✔ Only showing tabs (no filtering)
  const [activeTab, setActiveTab] = useState<"Website" | "Device">("Website");
  const tabs = ["Website", "Device"];

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const storedToken = token || user?.token || localStorage.getItem("token");

    if (!storedToken) {
      router.replace("/login");
    } else {
      fetchProjectList();
    }
  }, [hydrated, token, user, router, fetchProjectList]);

  const handleProjectSelect = (project: any) => {
    if (project.hash_id) {
      sessionStorage.setItem("selected_project_hash", project.hash_id);
    }
    router.push(`/ad-placement?project=${project.proj_slug_name}`);
  };

  if (!hydrated) {
    return (
      <MainLayout>
        <section className="min-h-screen flex items-center justify-center bg-[#17171a]">
          <p className="text-gray-400">Loading...</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen px-[5%] flex items-start justify-center pt-[120px] gap-10 bg-[#18181C] overflow-hidden">
        <div className="w-full max-w-7xl flex flex-col gap-5 h-full">
          <div className="w-full flex justify-start mt-5">
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex items-center gap-2 px-6 py-2 sm:py-3 rounded-xl font-thin text-sm sm:text-base transition-all duration-300 capitalize ${activeTab === tab
                    ? "bg-linear-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 min-h-[600px] items-center justify-center w-full">
            {activeTab === "Website" ? (
              <>
                {/* PAGE TITLE */}
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-3xl font-bold text-white text-center"
                >
                  Choose Website
                </motion.h2>

                {/* PROJECT LIST */}
                {loadingFetch ? (
                  <div className="flex items-center justify-center gap-5">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : (
                  <motion.div
                    className="flex gap-5 flex-wrap justify-center mt-5 w-full"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.15 } },
                    }}
                  >
                    {projectList.length > 0 ? (
                      projectList.map((project) => (
                        <motion.div
                          key={project.proj_id}
                          onClick={() => handleProjectSelect(project)}
                          variants={{
                            hidden: { opacity: 0, y: 50, scale: 0.9 },
                            visible: { opacity: 1, y: -5, scale: 1 },
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="relative group size-[300px] rounded-2xl cursor-pointer transition-all duration-300 ease-in-out border-none bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)] hover:p-0.5"
                        >
                          <div className="flex h-full w-full flex-col items-center justify-center bg-[#231F29] rounded-xl transition-transform duration-300">
                            <Image
                              src={project.file_url || "/images/placeholder.png"}
                              alt={project.proj_name}
                              width={200}
                              height={150}
                              className="transition duration-500 ease-in-out object-cover group-hover:scale-110 object-center rounded-xl"
                            />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-400">No projects found.</p>
                    )}
                  </motion.div>
                )}
              </>
            ) : (
              <DeviceContent />
            )}
          </div>

        </div>
      </section>
    </MainLayout>
  );

}
