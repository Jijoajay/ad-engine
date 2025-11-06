import Link from "next/link";
import { Plus } from "lucide-react";
import { ButtonColorful } from "../ui/button-colorful";

interface BreadcrumbProps {
  pageName: string;
  createPath?: string; 
}

const Breadcrumb = ({ pageName, createPath }: BreadcrumbProps) => {
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
        {/* <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium text-gray-500 dark:text-gray-300" href="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">{pageName}</li>
          </ol>
        </nav> */}

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
