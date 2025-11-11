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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Eye, MousePointerClick, Pencil } from "lucide-react";

interface DynamicGridProps {
  isAds?: boolean
  isContain?: boolean
  data: Record<string, any>[];
  onToggle?: (row: Record<string, any>) => Promise<boolean | void> | void;
  onDelete?: (row: Record<string, any>) => Promise<boolean | void> | void;
  onEdit?: (row: Record<string, any>) => void; // Added edit handler
  defaultRowsPerPage?: number;
}

export function DynamicGrid({
  data,
  onToggle,
  onDelete,
  onEdit,
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      pages.push(1);
      if (startPage > 2) pages.push("…");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDelete = async (ad: any) => {
    const result = await Swal.fire({
      title: "Delete this advertisement?",
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
        text: "The advertisement has been deleted.",
        icon: "success",
        background: "#000000",
        color: "#ffffff",
      });
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {paginatedData.length > 0 ? (
          paginatedData.map((ad) => (
            <div
              key={ad.advt_id || ad.proj_id}
              className="rounded-2xl border border-gray-800 p-5 bg-[#12101A] hover:bg-[#1C1A25] transition-all duration-300 relative shadow-sm"
            >
              {/* Dropdown Menu */}
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
                    {/* Edit Option */}
                    <DropdownMenuItem
                      onClick={() => onEdit?.(ad)}
                      className="cursor-pointer hover:bg-gray-800 text-blue-400"
                    >
                      Edit
                    </DropdownMenuItem>

                    {/* Toggle Status */}
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

                    {/* Delete */}
                    <DropdownMenuItem
                      onClick={() => handleDelete(ad)}
                      className="cursor-pointer hover:bg-gray-800 text-red-400"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Image */}
              <div className="relative w-full h-44 mb-3 rounded-xl overflow-hidden bg-[#2E2C36]">
                {ad.file_url ? (
                  isContain ? (
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

              {/* Project Info */}
              <div>
                <h3 className="font-semibold text-base text-white truncate">
                  {ad.proj_name || ad.advt_name || ad.mddt_name || "Untitled"}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {ad.page_name || ad.description}
                </p>
              </div>

              {/* Stats */}
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

              {/* Status */}
              {( ad.advt_status || ad.mddt_status || ad.proj_status ) !== undefined && (
                <div className="mt-3">
                  <span
                    className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${ ( ad.advt_status || ad.mddt_status || ad.proj_status ) === 1
                      ? "bg-green-900 text-green-300"
                      : "bg-red-900 text-red-300"
                      }`}
                  >
                    { ( ad.advt_status || ad.mddt_status || ad.proj_status )  === 1 ? "Active" : "Inactive"}
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Rows per page:</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20 bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              {[4, 8, 12, 20].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, idx) =>
              page === "…" ? (
                <span key={idx} className="text-gray-500">
                  …
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(page as number)}
                  className={cn(
                    "relative h-10 px-4 rounded-lg overflow-hidden",
                    "text-white font-medium transition-all duration-200",
                    "border border-gray-700",
                    currentPage === page
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  )}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
