"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader2, Edit, Trash2, RefreshCcw, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface DynamicTableProps {
  data: Record<string, any>[];
  columns: {
    key: string;
    label: string;
    isImage?: boolean;
    isDate?: boolean;
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

  const router = useRouter();
  const searchParams = useSearchParams();

  const rowsParam = searchParams.get("rows");
  const pageParam = searchParams.get("page");

  const [rowsPerPage, setRowsPerPage] = useState(
    rowsParam ? Number(rowsParam) : defaultRowsPerPage
  );

  const [currentPage, setCurrentPage] = useState(
    pageParam ? Number(pageParam) : 1
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [rowsPerPage, totalPages]);

  const updateURL = (page: number, rows: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    params.set("rows", String(rows));

    router.push(`?${params.toString()}`);
  };

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
                <tr key={idx} className="border-t border-[#33353A]">

                  <td className="px-4 py-3">{startItem + idx}</td>

                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">

                      {col.isImage ? (
                        <div className="relative w-[70px] h-12 bg-[#2E2C36] rounded-md overflow-hidden">

                          {isContain ? (
                            <Image
                              src={row[col.key] || "/images/placeholder.png"}
                              alt={col.label}
                              width={60}
                              height={48}
                              className="object-contain"
                            />
                          ) : (
                            <Image
                              src={row[col.key] || "/images/placeholder.png"}
                              alt={col.label}
                              fill
                              className="object-cover"
                            />
                          )}

                        </div>
                      ) : col.label === "Status" ? (

                        <span
                          className={`px-3 py-1 rounded-full text-xs ${row[col.key] === 1
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                            }`}
                        >
                          {isClientAds
                            ? row[col.key] === 1
                              ? "Running"
                              : "Stopped"
                            : row[col.key] === 1
                              ? "Active"
                              : "Inactive"}
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
                        <button className="p-2 hover:bg-gray-800 rounded-full">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-48 bg-gray-900 text-white border border-gray-700">

                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            View
                          </DropdownMenuItem>
                        )}

                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}

                        {onChangeStatus &&
                          columns.some((c) => c.label === "Status") && (
                            <DropdownMenuItem
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
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Toggle Status
                            </DropdownMenuItem>
                          )}

                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(row)}
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                            Delete
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

      {/* PAGINATION */}

      <div className="mt-6 flex justify-between items-center">

        <div className="flex items-center gap-2 text-sm text-gray-500">

          Rows Per Page:

          <select
            value={rowsPerPage}
            onChange={(e) => {
              const value = Number(e.target.value);

              setRowsPerPage(value);
              setCurrentPage(1);

              updateURL(1, value);
            }}
            className="bg-black border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

        </div>

        <div className="flex items-center gap-2">

          {pageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => {
                setCurrentPage(num);
                updateURL(num, rowsPerPage);
              }}
              className={`px-3 py-1 rounded ${currentPage === num
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300"
                }`}
            >
              {num}
            </button>
          ))}

        </div>

      </div>

      {/* DELETE DIALOG */}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#111] border border-gray-800 text-white">

          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Delete "{selectedRow?.proj_name || "this item"}" ?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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