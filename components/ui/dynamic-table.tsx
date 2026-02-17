"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
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
  onChangeStatus?: (
    row: Record<string, any>,
    newStatus: number
  ) => Promise<void> | void;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const openDeleteDialog = (row: any) => {
    setSelectedRow(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;

    try {
      setIsDeleting(true);
      await onDelete?.(selectedRow);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
      setSelectedRow(null);
    }
  };


  const startItem = (currentPage - 1) * rowsPerPage + 1;

  const pageNumbers = () => {
    const siblingCount = 2;
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      {/* TABLE */}
      <div className="rounded-xl bg-[#222327] text-[#F0F0F0] shadow-lg">
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
                  <td className="px-4 py-3">{startItem + idx}</td>

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

                        {onChangeStatus &&
                          columns.some((c) => c.label === "Status") && (
                            <DropdownMenuItem
                              className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                              onClick={() => {
                                const statusCol = columns.find(
                                  (c) => c.label === "Status"
                                );
                                if (!statusCol) return;
                                const currentStatus = row[statusCol.key];
                                onChangeStatus(
                                  row,
                                  currentStatus === 1 ? 0 : 1
                                );
                              }}
                            >
                              <RefreshCcw
                                className={`h-4 w-4 ${row[
                                    columns.find(
                                      (c) => c.label === "Status"
                                    )!.key
                                  ] === 1
                                    ? "text-yellow-400"
                                    : "text-green-400"
                                  }`}
                              />
                              {isClientAds
                                ? row[
                                  columns.find(
                                    (c) => c.label === "Status"
                                  )!.key
                                ] === 1
                                  ? "Stop"
                                  : "Start"
                                : row[
                                  columns.find(
                                    (c) => c.label === "Status"
                                  )!.key
                                ] === 1
                                  ? "Deactivate"
                                  : "Activate"}
                            </DropdownMenuItem>
                          )}

                        {onDelete && (
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => openDeleteDialog(row)}
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

      {/* --- PAGINATION FROM PAGINATEDTABLE --- */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 gap-2 text-sm text-gray-500">
          <label htmlFor="pageSize" className="whitespace-nowrap">
            Rows Per Page:
          </label>

          <select
            id="pageSize"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-black text-gray-400 border border-gray-300 rounded-md px-2 w-[60px] py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#111] border border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Delete "
              {selectedRow?.dvty_name ||
                selectedRow?.advt_name ||
                selectedRow?.proj_name ||
                "this item"}
              "?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}
