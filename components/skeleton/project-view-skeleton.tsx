"use client";

import AdminLayout from "@/layout/AdminLayout";
import React from "react";

export const ProjectViewSkeleton = () => {
  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen flex justify-center items-start">
        <div className="w-full flex flex-col items-center text-center space-y-6 animate-pulse">
          {/* Image Placeholder */}
          <div className="w-[280px] h-[280px] bg-neutral-800 rounded-xl border border-neutral-700 p-5"></div>

          {/* Title Placeholder */}
          <div className="h-8 w-1/2 bg-neutral-800 rounded"></div>

          {/* Description Placeholder */}
          <div className="space-y-3 w-3/4">
            <div className="h-4 w-full bg-neutral-800 rounded"></div>
            <div className="h-4 w-2/3 bg-neutral-800 rounded"></div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            <div className="h-4 w-24 bg-neutral-800 rounded"></div>
            <div className="h-4 w-24 bg-neutral-800 rounded"></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
