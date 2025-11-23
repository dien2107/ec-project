import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown, SquarePen, Trash } from "lucide-react";
import { SortableHeader } from "../../components/data-table";

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
  supplierId?: number;
}

export type Supplier = {
  supplierId: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  statusId: number;
  statusName: string;
  status: {
    statusId: number;
    name: string;
    displayName: string;
    entityType: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const getSupplierColumns = (
  handleEdit: (supplier: Supplier) => void,
  handleDelete: (supplier: Supplier) => void
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "supplierId",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Mã NCC"
        className="justify-start"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Tên nhà cung cấp"
        className="justify-start"
      />
    ),
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-800">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "contactName",
    header: "Người liên hệ",
    cell: ({ getValue }) => getValue() || "--",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <span className="truncate max-w-[200px]" title={getValue() as string}>
        {getValue() || "--"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ getValue }) => getValue() || "--",
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ getValue }) => (
      <span className="truncate max-w-[250px]" title={getValue() as string}>
        {getValue() || "--"}
      </span>
    ),
  },
  {
    accessorKey: "statusId", // Thay vì "statusName" để xử lý logic
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusId = row.original.statusId;
      let colorClass = "";
      switch (statusId) {
        case 62: // Đang hợp tác
          colorClass = "bg-green-100 text-green-700";
          break;
        case 63: // Ngưng hợp tác
          colorClass = "bg-gray-100 text-gray-600";
          break;
        case 64: // Đình chỉ hợp tác
          colorClass = "bg-red-100 text-red-600";
          break;
        case 65: // Đã chặn
          colorClass = "bg-yellow-100 text-yellow-700";
          break;
      }

      return (
        <span
          className={`px-3 py-1 text-sm rounded-full font-medium ${colorClass}`}
        >
          {status.displayName}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString("vi-VN"),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const statusId = row.original.statusId;
      const isDisabled = statusId === 64; // Ngưng hợp tác - không cho phép thao tác

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original)}
            disabled={isDisabled}
            title={
              isDisabled
                ? "Không thể chỉnh sửa nhà cung cấp đã ngưng hợp tác"
                : "Sửa"
            }
          >
            <SquarePen className="w-4 h-4 mr-1" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original)}
            disabled={isDisabled}
            title={
              isDisabled ? "Không thể xóa nhà cung cấp đã ngưng hợp tác" : "Xóa"
            }
          >
            <Trash className="w-4 h-4 mr-1" />
            Xóa
          </Button>
        </div>
      );
    },
  },
];
