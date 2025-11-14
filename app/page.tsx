"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { useProjectStore } from "@/store/use-project-store";
import { SkeletonCard } from "@/components/skeleton/card-skeleton";

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const { user, token } = useAuthStore();
  const { projectList, fetchProjectList, loadingFetch } = useProjectStore();

  const [hydrated, setHydrated] = useState(false);

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

  const handleNext = () => {
    if (selected) {
      const selectedProject = projectList.find(
        (p) => p.proj_name === selected
      );
      if (selectedProject) {
        if(selectedProject.hash_id){
          sessionStorage.setItem("selected_project_hash", selectedProject.hash_id);
        }
        router.push(`/ad-placement?project=${selectedProject.proj_slug_name}`);
      }
    } else {
      toast.error("Please select a project first!");
    }
  };

  console.log("projectList", projectList)

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
      <section className="min-h-screen flex flex-col items-center justify-center gap-10 bg-[#18181C] overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold text-white"
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
            className="flex gap-5 flex-wrap justify-center"
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
                  onClick={() => setSelected(project.proj_name)}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.9 },
                    visible: { opacity: 1, y: -5, scale: 1 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`relative group size-[300px] rounded-xl p-0.5 cursor-pointer transition-all duration-300 ease-in-out
                    ${selected === project.proj_name
                      ? "bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]"
                      : "bg-[#231F29] border border-[#4C4C4C]"
                    }`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#231F29] transition-transform duration-300">
                    <Image
                      src={project.file_url || "/images/placeholder.png"}
                      alt={project.proj_name}
                      width={200}
                      height={150}
                      className="transition duration-500 ease-in-out object-cover group-hover:scale-110 object-center"
                    />
                    {/* <p className="mt-3 text-white font-medium text-sm">
                      {project.proj_name}
                    </p> */}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No projects found.</p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <ButtonColorful
            label="Next"
            isIcon={false}
            onClick={handleNext}
            className="w-full sm:w-auto h-10 sm:h-11 md:h-12 px-4 sm:px-6 md:px-8 text-sm sm:text-base bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          />
        </motion.div>
      </section>
    </MainLayout>
  );
}
