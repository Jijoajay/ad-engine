"use client";

import Link from "next/link";
import { LayoutGrid, List, Plus } from "lucide-react";
import { ButtonColorful } from "../ui/button-colorful";
import { Button } from "../ui/button";
import DynamicFilter, { FilterConfig } from "../dynmaic-filter";

interface BreadcrumbProps {
  pageName: string;
  createPath?: string;
  isIcon?: boolean;
  viewMode?: string;
  setViewMode?: React.Dispatch<React.SetStateAction<"grid" | "list">>;

  // NEW FILTER PROPS
  filterConfig?: FilterConfig[];
  onFilterChange?: (filters: Record<string, any>) => void;
}

const Breadcrumb = ({
  pageName,
  createPath,
  viewMode,
  setViewMode,
  isIcon = false,
  filterConfig = [],
  onFilterChange,
}: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      
      <div className="flex items-center gap-4">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          {pageName}
        </h2>
      </div>


      <div className="flex items-center gap-4">
        {filterConfig.length > 0 && (
          <div className="flex">
            <DynamicFilter config={filterConfig} onChange={onFilterChange} />
          </div>
        )}
        {isIcon && (
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer hover:text-purple-500 hover:border-purple-500 transition-all"
            onClick={() => setViewMode?.(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
          </Button>
        )}

        {createPath && (
          <Link href={createPath}>
            <ButtonColorful label={`Create ${pageName}`} icon={<Plus className="h-4 w-4" />} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
