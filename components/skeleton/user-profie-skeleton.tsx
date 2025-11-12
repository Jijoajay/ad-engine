"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const UserProfileSkeleton = () => {
  return (
    <div className="space-y-6 max-w-4xl mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-800" />
            <Skeleton className="h-10 w-full bg-gray-800" />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <Skeleton className="h-10 w-28 bg-gray-800" />
      </div>
    </div>
  );
};
