"use client";

import { useProjectStore } from "@/store/use-project-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { ProjectViewSkeleton } from "@/components/skeleton/project-view-skeleton";
import AdminLayout from "@/layout/AdminLayout";

const ProjectViewPage = () => {
  const { slug_id } = useParams<{ slug_id: string }>();
  const { loadingFetch, fetchProjectById, projectData } = useProjectStore();

  useEffect(() => {
    if (slug_id && slug_id !== "0") {
      fetchProjectById(slug_id);
    }
  }, [slug_id, fetchProjectById]);

  if (loadingFetch) return <ProjectViewSkeleton />;

  if (!projectData)
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-400 bg-black">
        No Project Found
      </div>
    );

  const { proj_name, proj_desc, file_url, proj_created, proj_status } = projectData;

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen text-white">
        <div className="bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 p-8 flex flex-col items-center text-center space-y-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image
              src={file_url}
              alt={proj_name}
              width={280}
              height={280}
              className="object-cover rounded-xl border border-neutral-700 p-5"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-white">{proj_name}</h1>

          {/* Description */}
          <p className="text-gray-400 text-base max-w-2xl">{proj_desc}</p>

          {/* Info Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            <div className="text-gray-300 text-sm">
              <span className="block text-gray-500 text-xs mb-1">Created</span>
              {new Date(proj_created).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>

            <div className="h-5 w-px bg-neutral-700 hidden sm:block" />

            <div className="text-gray-300 text-sm">
              <span className="block text-gray-500 text-xs mb-1">Status</span>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${proj_status === 1
                    ? "bg-green-800/30 text-green-400"
                    : "bg-red-800/30 text-red-400"
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${proj_status === 1 ? "bg-green-400" : "bg-red-400"
                    }`}
                ></span>
                {proj_status === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProjectViewPage;
