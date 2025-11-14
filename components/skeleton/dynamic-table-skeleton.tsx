import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DynamicTableSkeletonProps {
  title?: string;
  columns: { key: string; label: string }[];
  rows?: number;
}

export function DynamicTableSkeleton({
  title = "Loading...",
  columns,
  rows = 5,
}: DynamicTableSkeletonProps) {
  return (
    <div className="rounded-xl bg-[#222327]  text-[#F0F0F0] shadow-lg">
      {/* <h2 className="px-4 py-6 text-2xl font-bold md:px-6 xl:px-9">
        {title}
      </h2> */}

      <Table>
        <TableHeader>
          <TableRow className="border-t border-[#33353A] text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="min-w-[120px] text-white font-semibold"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-gray-800">
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <Skeleton className="h-6 w-full bg-[#222327] " />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
