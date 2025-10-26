import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import Pagination from "~/components/common/pagination";
import { Button } from "~/components/ui/button";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filterColumn?: string;
  filterPlaceholder?: string;
  expandedRowContent?: (product: TData) => React.ReactNode;
  globalFilterFn?: (row: any, columnId: string, filterValue: string) => boolean;
}

export function SortableHeader({
  column,
  title,
  className,
  children,
}: {
  column: any;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const sorted = column.getIsSorted() as string | false;
  return (
    <Button
      variant="ghost"
      className={`flex items-center gap-1 ${className}`}
      onClick={column.getToggleSortingHandler()}
    >
      {children ? <>{children}</> : title}
      {{
        asc: <ArrowUp className="ml-1" />,
        desc: <ArrowDown className="ml-1" />,
      }[sorted as string] ?? <ArrowUpDown className="ml-1" />}
    </Button>
  );
}

export default function DataTable<TData, TValue>({
  className,
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  expandedRowContent,
  globalFilterFn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    enableSortingRemoval: true,
  });

  return (
    <div className={`bg-white p-0 rounded-lg shadow-md ${className}`}>
      <div className="h-6"></div>
      {/* Table */}
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  const sticky = header.column.columnDef.sticky;
                  return (
                    <TableHead
                      key={header.id}
                      className={`bg-[#F8FAFC] text-[#647AA8] font-semibold ${
                        sticky ? "sticky-col bg-[#F8FAFC] z-20 left-0" : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="bg-white hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell, idx) => {
                      const sticky = cell.column.columnDef.sticky;
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            sticky ? "sticky-col bg-[#F8FAFC] z-20 left-0" : ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Render expanded row content */}
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        {expandedRowContent
                          ? expandedRowContent(row.original)
                          : null}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center pb-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
