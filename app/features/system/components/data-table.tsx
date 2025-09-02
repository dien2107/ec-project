import * as React from "react";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import Pagination from "~/components/common/pagination";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import {
  ChevronDown,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  title: string;
  filterColumn?: string;
  filterPlaceholder?: string;
  showFilter?: boolean;
  showGlobalFilter?: boolean;
  showVisibility?: boolean;
  showAddButton?: boolean;
  addButtonTitle?: string;
  onAddClick?: () => void;
  expandedRowContent?: (product: TData) => React.ReactNode;
  globalFilterFn?: (row: any, columnId: string, filterValue: string) => boolean;
  globalFilterPlaceholder?: string;
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
  title = "Danh sách",
  showFilter = false,
  showGlobalFilter = false,
  showVisibility = false,
  showAddButton = false,
  addButtonTitle = "Thêm",
  onAddClick,
  expandedRowContent,
  globalFilterFn,
  globalFilterPlaceholder,
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
      <div className="flex justify-between items-center mb-4 pt-6 px-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex justify-center items-center space-x-2">
          {showGlobalFilter && (
            <Input
              placeholder={globalFilterPlaceholder ?? "Tìm kiếm..."}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          )}

          {showFilter &&
            table.getAllColumns().map((column) => {
              const meta = (column.columnDef as any).meta;
              if (!meta) return;

              // Render Input for type === text
              if (meta.filterConfig.type === "text") {
                return (
                  <Input
                    key={column.id}
                    placeholder={meta.filterConfig.placeholder}
                    value={(column.getFilterValue() as string) ?? ""}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  />
                );
              }

              // Render Combobox for type === select
              else if (meta.filterConfig.type === "select") {
                return (
                  <Select
                    key={column.id}
                    value={(column.getFilterValue() as string) ?? ""}
                    onValueChange={(value) => column.setFilterValue(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={meta.filterConfig.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Trạng thái</SelectLabel>
                        {meta.filterConfig.options.map(
                          (opt: { label: string; value: string }) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }
            })}

          {showAddButton && (
            <Button
              className="bg-[#3770EC] text-white cursor-pointer"
              onClick={onAddClick}
            >
              <Plus />
              {addButtonTitle}
            </Button>
          )}

          {/* Show visibility columns */}
          {showVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Tùy chỉnh cột <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-[#F8FAFC] text-[#647AA8] font-semibold"
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
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="bg-white hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
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
                </>
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
