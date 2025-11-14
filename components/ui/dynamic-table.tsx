"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Edit, Trash2, RefreshCcw, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
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
import Image from "next/image";

interface DynamicTableProps {
  title?: string;
  data: Record<string, any>[];
  columns: {
    key: string;
    label: string;
    isImage?: boolean;
    isDate?: boolean;
    align?: "left" | "right" | "center";
  }[];
  isClientAds?: boolean;
  isContain?: boolean;
  onView?: (row: Record<string, any>) => void;
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => Promise<void> | void;
  onChangeStatus?: (row: Record<string, any>, newStatus: number) => Promise<void> | void;
  defaultRowsPerPage?: number;
}

export function DynamicTable({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
  onChangeStatus,
  defaultRowsPerPage = 5,
  isContain = false,
  isClientAds = false,
}: DynamicTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [rowsPerPage, totalPages]);

  // SweetAlert2 Delete Confirmation
  const handleDelete = async (row: any) => {
    const name = row.dvty_name || "this item";

    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7e22ce",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#000000",
      color: "#ffffff",
      customClass: {
        popup: "rounded-lg shadow-lg border border-[#33353A]",
        confirmButton:
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg px-4 py-2",
        cancelButton:
          "bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-2",
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await onDelete?.(row);
        await Swal.fire({
          title: "Deleted!",
          text: `"${name}" has been deleted successfully.`,
          icon: "success",
          background: "#000000",
          color: "#ffffff",
          confirmButtonColor: "#7e22ce",
        });
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete. Please try again.",
          icon: "error",
          background: "#000000",
          color: "#ffffff",
          confirmButtonColor: "#7e22ce",
        });
      }
    }
  };

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

  return (
    <>
      <div className="rounded-xl bg-[#222327]  text-[#F0F0F0] shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#33353A] text-base">
              <th className="text-left px-4 py-3">SI No</th>
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="text-center px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-[#33353A] transition"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>

                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.isImage ? (
                        <div className="relative w-[70px] h-12 flex items-center justify-center bg-[#2E2C36] rounded-md overflow-hidden">
                          {isContain ? (
                            <Image
                              src={row[col.key] || "/images/placeholder.png"}
                              alt={col.label}
                              width={60}
                              height={48}
                              className="object-contain max-w-full max-h-full"
                            />
                          ) : (
                            <Image
                              src={row[col.key] || "/images/placeholder.png"}
                              alt={col.label}
                              fill
                              className="object-cover rounded-md border border-gray-700"
                              sizes="70px"
                            />
                          )}
                        </div>
                      ) : col.label === "Status" ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${row[col.key] === 1
                            ? "bg-green-500/20 text-green-400 border border-green-600"
                            : "bg-red-500/20 text-red-400 border border-red-600"
                            }`}
                        >
                          {row[col.key] === 1 ? "Active" : "Inactive"}
                        </span>
                      ) : col.isDate ? (
                        row[col.key]
                          ? new Date(row[col.key]).toLocaleDateString()
                          : "-"
                      ) : (
                        row[col.key] ?? "-"
                      )}
                    </td>
                  ))}

                  {/* Actions Dropdown */}
                  <td className="text-center px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-gray-800 transition">
                          <MoreHorizontal className="h-5 w-5 text-gray-300" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-gray-900 text-white border border-gray-700"
                      >
                        {onView && (
                          <DropdownMenuItem
                            onClick={() => onView(row)}
                            className="cursor-pointer hover:bg-gray-800 text-teal-400"
                          >
                            View
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => onEdit(row)}
                          >
                            <Edit className="h-4 w-4 text-blue-400" /> Edit
                          </DropdownMenuItem>
                        )}

                        {onChangeStatus && columns.some(c => c.label === "Status") && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                              const statusCol = columns.find(c => c.label === "Status");
                              if (!statusCol) return;
                              const currentStatus = row[statusCol.key];
                              onChangeStatus(row, currentStatus === 1 ? 0 : 1);
                            }}
                          >
                            <RefreshCcw
                              className={`h-4 w-4 ${row[columns.find(c => c.label === "Status")!.key] === 1
                                ? "text-yellow-400"
                                : "text-green-400"
                                }`}
                            />
                            {isClientAds
                              ? row[columns.find(c => c.label === "Status")!.key] === 1
                                ? "Stop"
                                : "Start"
                              : row[columns.find(c => c.label === "Status")!.key] === 1
                                ? "Deactivate"
                                : "Activate"}
                          </DropdownMenuItem>
                        )}

                        {onDelete && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleDelete(row)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="text-center py-6 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
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
              {[5, 10, 20, 50].map((num) => (
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
    </>
  );
}
