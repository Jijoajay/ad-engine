import Link from "next/link";
import { LayoutGrid, List, Plus } from "lucide-react";
import { ButtonColorful } from "../ui/button-colorful";
import { Button } from "../ui/button";

interface BreadcrumbProps {
  pageName: string;
  createPath?: string;
  isIcon?: boolean
  viewMode?:string;
  setViewMode?:any
  
}

const Breadcrumb = ({ pageName, createPath, viewMode, setViewMode, isIcon = false  }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          {pageName}
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {
          isIcon &&
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer hover:text-purple-500 hover:border-purple-500 transition-all duration-500 ease-in-out"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            title={viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
          >
            {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
          </Button>
        }

        {/* Create Button */}
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
