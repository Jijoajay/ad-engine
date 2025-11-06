"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MoreHorizontal, Edit, Trash2, RefreshCcw } from "lucide-react";
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
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => Promise<void> | void;
  onChangeStatus?: (row: Record<string, any>, newStatus: number) => Promise<void> | void;
  defaultRowsPerPage?: number;
}

export function DynamicTable({
  data,
  columns,
  onEdit,
  onDelete,
  onChangeStatus,
  defaultRowsPerPage = 5,
}: DynamicTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [rowsPerPage, totalPages]);

  // ✅ SweetAlert2 Delete Confirmation
  const handleDelete = async (row: any) => {
    const name = row.dvty_name || "this item";

    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7e22ce", // purple
      cancelButtonColor: "#374151", // gray
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#000000",
      color: "#ffffff",
      customClass: {
        popup: "rounded-lg shadow-lg border border-gray-800",
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
      <div className="rounded-[10px] bg-black text-white shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-base">
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
                  className="border-t border-gray-800 hover:bg-gray-900 transition"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>

                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {row[col.key] ?? "-"}
                    </td>
                  ))}

                  <td className="text-center">
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
                        {onEdit && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => onEdit(row)}
                          >
                            <Edit className="h-4 w-4 text-blue-400" /> Edit
                          </DropdownMenuItem>
                        )}
                        {onChangeStatus && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() =>
                              onChangeStatus(row, row.dvty_status === 1 ? 0 : 1)
                            }
                          >
                            <RefreshCcw className="h-4 w-4 text-yellow-400" />{" "}
                            {row.dvty_status === 1
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
