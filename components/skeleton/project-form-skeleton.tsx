"use client";

import AdminLayout from "@/layout/AdminLayout";
import React from "react";

export const ProjectFormSkeleton = () => {
  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen flex justify-center items-start">
        <div className="w-full animate-pulse space-y-6">
          {/* Title */}
          <div className="h-8 w-1/3 bg-neutral-800 rounded"></div>

          {/* Grid Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-12 bg-neutral-800 rounded"></div>
            <div className="h-12 bg-neutral-800 rounded"></div>
            <div className="col-span-2 h-32 bg-neutral-800 rounded"></div>
          </div>

          {/* Button */}
          <div className="h-10 w-28 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </AdminLayout>
  );
};
