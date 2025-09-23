import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown, SquarePen, Trash } from "lucide-react";
import { SortableHeader } from "../../components/data-table";

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  info: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

export interface SupplierFormData {
  name: string;
  contact: string;
  info: string;
  status: "active" | "inactive";
}

export interface AddSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface EditSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  supplier: Supplier | null;
}

export interface DeleteSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  supplierName?: string;
}

export const getSupplierColumns = (
  handleEdit: (supplier: Supplier) => void,
  handleDelete: (supplier: Supplier) => void
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Mã NCC"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Nhà cung cấp"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Liên hệ",
    cell: ({ getValue }) => {
      const contact = getValue() as string;
      const lines = contact.split('\n');
      return (
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="text-sm">
              {line}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "info",
    header: "Thông tin",
    cell: ({ getValue }) => {
      const info = getValue() as string;
      return (
        <div className="max-w-[200px] truncate" title={info}>
          {info}
        </div>
      );
    },
  },
  {
    accessorKey: "productCount",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Số sản phẩm"
          className="justify-center"
        />
      );
    },
    cell: ({ getValue }) => {
      const count = getValue() as number;
      return <div className="text-center">{count}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Trạng thái"
          className="justify-start"
        />
      );
    },
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày tạo"
          className="justify-start"
        />
      );
    },
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return new Date(date).toLocaleDateString('vi-VN');
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original)}
          >
            <SquarePen className="w-4 h-4 mr-1" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original)}
          >
            <Trash className="w-4 h-4 mr-1" />
            Xóa
          </Button>
        </div>
      );
    },
  },
];