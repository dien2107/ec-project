
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { SquarePen, Trash } from "lucide-react";

export type ImportOrder = {
  id: string;
  supplier: string;
  quantity: number;
  total: number;
  status: "pending" | "approved" | "received";
  orderDate: string;
  expectedDate: string;
};

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "bg-gray-100 text-gray-700" },
  approved: { label: "Đã duyệt", className: "bg-blue-600 text-white" },
  received: { label: "Đã nhận", className: "bg-blue-400 text-white" },
};

export const getImportOrderColumns = (
  handleEdit: (order: ImportOrder) => void,
  handleDelete: (order: ImportOrder) => void
): ColumnDef<ImportOrder>[] => [
  { accessorKey: "id", header: "Mã đơn hàng" },
  { accessorKey: "supplier", header: "Nhà cung cấp" },
  { accessorKey: "quantity", header: "Số lượng" },
  {
    accessorKey: "total",
    header: "Tổng tiền",
    cell: ({ row }: { row: { original: ImportOrder } }) => {
      return React.createElement("span", null, `$ ${row.original.total.toLocaleString("vi-VN")} đ`);
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }: { row: { original: ImportOrder } }) => {
      const status = row.original.status as keyof typeof statusMap;
      const map = statusMap[status] || { label: status, className: "" };
      return React.createElement(
        "span",
        {
          className: `px-3 py-1 rounded-2xl text-sm font-medium ${map.className}`,
        },
        map.label
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Tất cả trạng thái",
        options: [
          { value: "all", label: "Tất cả trạng thái" },
          { value: "pending", label: "Chờ duyệt" },
          { value: "approved", label: "Đã duyệt" },
        ],
      },
    },
    filterFn: (row: any, id: string, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  { accessorKey: "orderDate", header: "Ngày đặt" },
  { accessorKey: "expectedDate", header: "Ngày dự kiến" },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }: { row: { original: ImportOrder } }) => (
      <div className="flex gap-2">
        <Button size="icon" variant="outline" onClick={() => handleEdit(row.original)}>
          <SquarePen className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="destructive" onClick={() => handleDelete(row.original)}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
