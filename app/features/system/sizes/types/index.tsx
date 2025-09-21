import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type Size = {
  id: string;
  name: string;
  code: string;
  description: string;
  status: "active" | "inactive";
};

const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: "Hoạt động", className: "bg-green-600 text-white" },
  inactive: { label: "Ngưng hoạt động", className: "bg-red-500 text-white" },
};

export const getSizeColumns = (
  handleEdit: (size: Size) => void,
  handleDelete: (size: Size) => void
): ColumnDef<Size>[] => [
  {
    accessorKey: "id",
    header: "Mã kích thước",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "code",
    header: "Tên kích thước",
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
          {row.original.code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusMap;
      const map = statusMap[status] || { label: status, className: "" };
      return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${map.className}`}>
          {map.label}
        </span>
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Tất cả trạng thái",
        options: [
          { value: "all", label: "Tất cả trạng thái" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Ngưng hoạt động" },
        ],
      },
    },
    filterFn: (row: any, id: string, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(row.original)}
          className="h-8 w-8 p-0 hover:bg-green-100"
          title="Chỉnh sửa"
        >
          <Edit className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(row.original)}
          className="h-8 w-8 p-0 hover:bg-red-100"
          title="Xóa"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    ),
  },
];