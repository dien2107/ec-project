import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown, ChevronUp, SquarePen, Trash } from "lucide-react";
import type { S } from "node_modules/react-router/dist/development/context-jKip1TFB.mjs";

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  info: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

export const getSupplierColumns = (
  handleEdit: (supplier: Supplier) => void,
  handleDelete: (supplier: Supplier) => void
): ColumnDef<Supplier>[] => [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Nhà cung cấp" },
  { accessorKey: "contact", header: "Liên hệ" },
  { accessorKey: "info", header: "Thông tin" },
  { accessorKey: "productCount", header: "Số sản phẩm" },
  {
    accessorKey: "status",
    header: "Trạng thái",
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Không hoạt động" },
        ],
      },
    },
    cell: ({ getValue }) => {
      const status = getValue() as Supplier["status"];
      return (
        <span
          className={
            "inline-flex px-3 py-1 rounded-full text-sm font-medium " +
            (status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400")
          }
        >
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleEdit(row.original)}
          >
            <SquarePen className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDelete(row.original)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
