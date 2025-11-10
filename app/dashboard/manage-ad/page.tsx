"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAdStore } from "@/store/use-ad-store";
import Image from "next/image";
import { Eye, MousePointerClick } from "lucide-react";
import { AdGridSkeleton } from "@/components/skeleton/ad-grid-skeleton";
import AdminLayout from "@/layout/AdminLayout";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/breadcrumbs/bread-crumbs";

const Page = () => {
    const { adminAdvertisements, fetchAllAdminAd, loading } = useAdStore();

    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchAllAdminAd();
    }, [fetchAllAdminAd]);

    const totalPages = Math.ceil(adminAdvertisements.length / rowsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [rowsPerPage, totalPages]);

    const paginatedAds = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return adminAdvertisements.slice(start, start + rowsPerPage);
    }, [adminAdvertisements, currentPage, rowsPerPage]);

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

    if (loading) return <AdGridSkeleton />;

    if (!adminAdvertisements.length)
        return (
            <AdminLayout>
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <p className="text-center text-gray-400">No advertisements found.</p>
                </div>
            </AdminLayout>
        );

    return (
        <AdminLayout>
            <Breadcrumb
                pageName="Manage Ads"
                createPath="/dashboard/ad-upload"
            />
            <div className="min-h-screen bg-black text-white">
                {/* ✅ Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                    {paginatedAds.map((ad) => (
                        <div
                            key={ad.advt_id}
                            className="rounded-2xl border border-gray-800 p-4 shadow-sm bg-neutral-900 hover:bg-neutral-800 transition-all duration-300"
                        >
                            {/* ✅ Uniform Image Container */}
                            <div className="relative w-full h-48 mb-3 overflow-hidden rounded-xl bg-neutral-800">
                                {ad.file_url ? (
                                    <Image
                                        src={ad.file_url}
                                        alt={ad.page_name || "Advertisement"}
                                        fill
                                        className="object-cover object-center hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* ✅ Project & Page Info */}
                            <div>
                                <h3 className="font-semibold text-base text-white truncate">
                                    {ad.proj_name}
                                </h3>
                                <p className="text-sm text-gray-400 truncate">
                                    {ad.page_name}
                                </p>
                            </div>

                            {/* ✅ Stats */}
                            <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Eye size={16} />
                                    <span>{ad.advt_view_count}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MousePointerClick size={16} />
                                    <span>{ad.advt_click_count}</span>
                                </div>
                            </div>

                            {/* ✅ Status Badge */}
                            <div className="mt-3">
                                <span
                                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${ad.advt_status === 1
                                            ? "bg-green-900 text-green-300"
                                            : ad.advt_status === 2
                                                ? "bg-yellow-900 text-yellow-300"
                                                : "bg-red-900 text-red-300"
                                        }`}
                                >
                                    {ad.advt_status === 1
                                        ? "Active"
                                        : ad.advt_status === 2
                                            ? "Pending"
                                            : "Inactive"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ Pagination Section */}
                <div className="flex items-center justify-between mt-8">
                    {/* Rows per page */}
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

                    {/* Page numbers */}
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
        </AdminLayout>
    );
};

export default Page;
