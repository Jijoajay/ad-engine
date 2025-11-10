"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "@/layout/AdminLayout";

export function AdGridSkeleton() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-black p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800 p-4 shadow-sm bg-neutral-900 space-y-3"
            >
              {/* Image skeleton */}
              <Skeleton className="w-full h-40 rounded-xl bg-neutral-800" />

              {/* Text skeletons */}
              <Skeleton className="h-5 w-3/4 bg-neutral-800" />
              <Skeleton className="h-4 w-1/2 bg-neutral-800" />

              {/* Footer skeletons (views/clicks) */}
              <div className="flex gap-3">
                <Skeleton className="h-4 w-12 bg-neutral-800" />
                <Skeleton className="h-4 w-12 bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
