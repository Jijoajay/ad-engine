"use client";

import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useProjectStore } from "@/store/use-project-store";
import { SkeletonCard } from "@/components/skeleton/card-skeleton";

function HomeInnerComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStep = searchParams.get("type");

  const { user, token } = useAuthStore();
  const { projectList, fetchProjectList, loadingFetch } = useProjectStore();

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<"platform" | "website" | "device">("platform");

  // Hydration
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub?.();
  }, []);

  // Auth & fetch projects
  useEffect(() => {
    if (!hydrated) return;

    const storedToken = token || user?.token || localStorage.getItem("token");

    if (!storedToken) {
      router.replace("/login");
    } else {
      fetchProjectList();
    }
  }, [hydrated, token, user, router, fetchProjectList]);

  // Set step from query
  useEffect(() => {
    if (queryStep === "website" || queryStep === "device") {
      setStep(queryStep);
    } else {
      setStep("platform");
    }
  }, [queryStep]);

  const handleProjectSelect = (project: any) => {
    if (project.hash_id)
      sessionStorage.setItem("selected_project_hash", project.hash_id);

    router.push(`/ad-placement?project=${project.proj_slug_name}&type=website`);
  };

  const handlePlatformSelect = (platform: "website" | "device") => {
    setStep(platform);
    router.push(`/?type=${platform}`);
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

  const PlatformCard = ({
    title,
    image,
    onClick,
  }: {
    title: string;
    image: string;
    onClick: () => void;
  }) => (
    <motion.div
      onClick={onClick}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: -5, scale: 1 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6 }}
      className="relative group size-[300px] rounded-2xl cursor-pointer transition-all duration-300 ease-in-out border-none bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)] hover:p-0.5"
    >
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#231F29] rounded-xl">
        <Image src={image} width={150} height={150} alt={title} />
        <p className="text-white mt-3 text-xl">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <MainLayout>
      <section className="min-h-screen h-screen px-[5%] flex items-start justify-center pt-[120px] gap-10 bg-[#18181C] overflow-hidden">
        <div className="w-full max-w-7xl flex flex-col gap-5 items-center justify-center h-full">

          {/* PLATFORM STEP */}
          {step === "platform" && (
            <>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-white text-center"
              >
                Choose Platform
              </motion.h2>

              <div className="flex gap-5 flex-wrap justify-center mt-5">
                <PlatformCard
                  title="Website"
                  image="/images/website.png"
                  onClick={() => handlePlatformSelect("website")}
                />
                <PlatformCard
                  title="Device"
                  image="/images/device.png"
                  onClick={() => handlePlatformSelect("device")}
                />
              </div>
            </>
          )}

          {/* WEBSITE STEP */}
          {step === "website" && (
            <>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-white text-center"
              >
                Choose Website
              </motion.h2>

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
                        transition={{ duration: 0.6 }}
                        className="relative group size-[300px] rounded-2xl cursor-pointer transition-all duration-300 ease-in-out border-none bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)] hover:p-0.5"
                      >
                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#231F29] rounded-xl">
                          <Image
                            src={project.file_url || "/images/placeholder.png"}
                            alt={project.proj_name}
                            width={200}
                            height={150}
                            className="transition duration-500 ease-in-out object-cover group-hover:scale-110 object-center"
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
          )}

          {/* DEVICE STEP */}
          {step === "device" && (
            <>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-white text-center"
              >
                Choose Device
              </motion.h2>

              <div className="flex gap-5 flex-wrap justify-center mt-5">
                <PlatformCard
                  title="iOS"
                  image="/images/ios.png"
                  onClick={() => router.push("/ad-upload?type=device")}
                />
                <PlatformCard
                  title="Android"
                  image="/images/android.png"
                  onClick={() => router.push("/ad-upload?type=device")}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default function HomeComponent() {
  return (
    <HomeInnerComponent />
  );
}
