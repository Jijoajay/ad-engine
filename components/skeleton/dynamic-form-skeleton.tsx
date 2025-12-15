"use client";

import AdminLayout from "@/layout/AdminLayout";
import React from "react";

interface DynamicFormSkeletonProps {
  title?: string;
  fieldCount?: number;
}

export const DynamicFormSkeleton: React.FC<DynamicFormSkeletonProps> = ({
  title = "Loading...",
  fieldCount = 4,
}) => {
  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto bg-[#222327] min-h-screen flex justify-center items-start">
        <div className="w-full animate-pulse space-y-6">
          {/* Title */}
          <div className="h-8 w-1/3 bg-neutral-800 rounded"></div>

          {/* Dynamic field grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: fieldCount }).map((_, i) => (
              <div
                key={i}
                className={`${
                  i % 3 === 2 ? "col-span-2 h-32" : "h-12"
                } bg-neutral-800 rounded`}
              ></div>
            ))}
          </div>

          {/* Button */}
          <div className="h-10 w-28 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </AdminLayout>
  );
};
