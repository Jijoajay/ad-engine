"use client";

import AdminLayout from "@/layout/AdminLayout";

export const AdCardSkeleton = () => {
  return (
    <div className="bg-[#231F29] w-full flex flex-col sm:flex-row border border-[#4C4C4C] rounded-xl overflow-hidden max-w-7xl h-[450px] animate-pulse">
      <div className="flex flex-col justify-between sm:w-[65%] w-full p-6 gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-4 w-full sm:w-auto">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-700 rounded"></div>
              <div className="h-4 w-56 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-36 bg-gray-700 rounded"></div>
              <div className="h-4 w-64 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-28 bg-gray-700 rounded"></div>
              <div className="h-4 w-40 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-24 bg-gray-700 rounded"></div>
        </div>

        {/* Bottom button placeholder */}
        <div className="flex justify-start w-full md:justify-center">
          <div className="h-10 w-full bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Right Section (image) */}
      <div className="relative sm:w-[35%] w-full h-[250px] sm:h-auto bg-gray-800"></div>
    </div>
  );
};
