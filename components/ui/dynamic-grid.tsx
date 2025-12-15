"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, MousePointerClick } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DynamicGridProps {
  isAds?: boolean;
  isContain?: boolean;
  data: Record<string, any>[];
  onToggle?: (row: Record<string, any>) => Promise<boolean | void> | void;
  onDelete?: (row: Record<string, any>) => Promise<boolean | void> | void;
  onEdit?: (row: Record<string, any>) => void;
  onView?: (row: Record<string, any>) => void;
  defaultRowsPerPage?: number;
}

export function DynamicGrid({
  data,
  onToggle,
  onDelete,
  onEdit,
  onView,
  isAds = false,
  isContain = false,
  defaultRowsPerPage = 8,
}: DynamicGridProps) {
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [rowsPerPage, totalPages]);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const pageNumbers = () => {
    const siblingCount = 2;
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleDelete = async (ad: any) => {
    const name = ad.advt_name || ad.proj_name || "this item";

    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7e22ce",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete it!",
      background: "#000000",
      color: "#ffffff",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await onDelete?.(ad);
      Swal.fire({
        title: "Deleted!",
        text: `"${name}" has been deleted.`,
        icon: "success",
        background: "#000000",
        color: "#ffffff",
      });
    }
  };

  return (
    <div className="bg-[#222327] text-white px-4 py-4 rounded-xl">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedData.length > 0 ? (
          paginatedData.map((ad) => (
            <div
              key={ad.advt_id || ad.proj_id}
              className="rounded-2xl border border-gray-800 p-5 bg-[#12101A] hover:bg-[#1C1A25] transition-all duration-300 relative shadow-sm"
            >
              {/* Dropdown */}
              <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
                      <MoreVertical size={18} className="text-gray-300" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-900 border border-gray-700 text-white rounded-md w-32"
                  >
                    {onView && (
                      <DropdownMenuItem
                        onClick={() => onView(ad)}
                        className="cursor-pointer hover:bg-gray-800 text-teal-400"
                      >
                        View
                      </DropdownMenuItem>
                    )}

                    {onEdit && (
                      <DropdownMenuItem
                        onClick={() => onEdit(ad)}
                        className="cursor-pointer hover:bg-gray-800 text-blue-400"
                      >
                        Edit
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => onToggle?.(ad)}
                      className={cn(
                        "cursor-pointer hover:bg-gray-800",
                        ad.advt_status === 1
                          ? "text-yellow-400"
                          : "text-green-400"
                      )}
                    >
                      {isAds
                        ? ad.advt_status === 1
                          ? "Stop"
                          : "Start"
                        : ad.advt_status === 1
                          ? "Active"
                          : "Inactive"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDelete(ad)}
                      className="cursor-pointer hover:bg-gray-800 text-red-400"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Image / Video */}
              <div className="relative w-full h-44 mb-3 rounded-xl overflow-hidden bg-[#2E2C36]">
                {ad.file_url ? (
                  ad.file_url.toLowerCase().endsWith(".mp4") ? (
                    <video
                      src={ad.file_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : isContain ? (
                    <div className="flex items-center justify-center h-full w-full">
                      <Image
                        src={ad.file_url}
                        alt={ad.page_name || "Image"}
                        width={200}
                        height={200}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                  ) : (
                    <Image
                      src={ad.file_url}
                      alt={ad.page_name || "Image"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>


              {/* Info */}
              <h3 className="font-semibold text-base text-white truncate">
                {ad.proj_name || ad.advt_name || ad.mddt_name || "Untitled"}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {ad.page_name || ad.description}
              </p>

              {(ad.advt_view_count || ad.advt_click_count) && (
                <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} /> {ad.advt_view_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <MousePointerClick size={16} /> {ad.advt_click_count}
                  </div>
                </div>
              )}

              {(ad.advt_status || ad.mddt_status || ad.proj_status) !==
                undefined && (
                  <div className="mt-3">
                    <span
                      className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${(ad.advt_status ||
                        ad.mddt_status ||
                        ad.proj_status) === 1
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                        }`}
                    >
                      {(ad.advt_status ||
                        ad.mddt_status ||
                        ad.proj_status) === 1
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full mt-10">
            No advertisements found.
          </p>
        )}
      </div>

      {/* --- SAME PAGINATION AS DynamicTable --- */}
      <div className="mt-5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Rows Per Page */}
        <div className="flex items-center space-x-2 gap-2 text-sm text-gray-500">
          <label htmlFor="pageSize">Rows Per Page:</label>

          <select
            id="pageSize"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-black text-gray-400 border border-gray-300 rounded-md px-2 w-[60px] py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {[4, 8, 12, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-400"
          >
            «
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-400"
          >
            ‹
          </button>

          {pageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${currentPage === num
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "hover:bg-gray-200 hover:text-purple-500 text-gray-200"
                }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-400"
          >
            ›
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-400"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
