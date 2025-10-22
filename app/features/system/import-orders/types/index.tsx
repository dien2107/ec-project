import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { SortableHeader } from "../../components/data-table";
import { Edit, Trash2 } from "lucide-react";
import { formatVND } from "~/libs";

export type ImportOrder = {
  id: string;
  supplier: string;
  quantity: number;
  total: number;
  status: "pending" | "approved" | "received";
  orderDate: string;
  expectedDate: string;
};

export interface ImportOrderFormData {
  supplier: string;
  quantity: number;
  total: number;
  status: "pending" | "approved" | "received";
  orderDate: string;
  expectedDate: string;
}

export interface AddImportOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (order: ImportOrder) => void;
}

export interface EditImportOrderDialogProps {
  open: boolean;
  order: ImportOrder | null;
  onClose: () => void;
  onSave: (order: ImportOrder) => void;
}

export interface DeleteImportOrderDialogProps {
  open: boolean;
  order: ImportOrder | null;
  onClose: () => void;
  onDelete: (order: ImportOrder) => void;
}

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800" },
  received: { label: "Đã nhận", className: "bg-green-100 text-green-800" },
};

export const getImportOrderColumns = (
  handleEdit: (order: ImportOrder) => void,
  handleDelete: (order: ImportOrder) => void
): ColumnDef<ImportOrder>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Mã đơn hàng"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "supplier",
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
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Số lượng"
          className="justify-center"
        />
      );
    },
    cell: ({ getValue }) => {
      const quantity = getValue() as number;
      return (
        <div className="text-center">{quantity.toLocaleString("vi-VN")}</div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Tổng tiền"
          className="justify-end"
        />
      );
    },
    cell: ({ getValue }) => {
      const total = getValue() as number;
      return <div className="text-right font-medium">{formatVND(total)}</div>;
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
        placeholder: "Tất cả trạng thái",
        options: [
          { value: "all", label: "Tất cả trạng thái" },
          { value: "pending", label: "Chờ duyệt" },
          { value: "approved", label: "Đã duyệt" },
          { value: "received", label: "Đã nhận" },
        ],
      },
    },
    cell: ({ getValue }) => {
      const status = getValue() as keyof typeof statusMap;
      const statusInfo = statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày đặt"
          className="justify-start"
        />
      );
    },
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "expectedDate",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày dự kiến"
          className="justify-start"
        />
      );
    },
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return new Date(date).toLocaleDateString("vi-VN");
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
