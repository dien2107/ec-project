import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import { Eye, Package, DollarSign, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { SortableHeader } from "../../components/data-table";

// Types
export interface ImportItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ImportRecord {
  id: string;
  supplier: string;
  quantity: number;
  totalAmount: number;
  importDate: string;
  createdBy: string;
  status: "completed" | "pending" | "cancelled";
  notes?: string;
  items: ImportItem[];
}

// Helper functions
export const getStatusColor = (status: ImportRecord["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getStatusLabel = (status: ImportRecord["status"]) => {
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "pending":
      return "Đang xử lý";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

// Column definitions
export const getColumns = (
  handleViewImport: (importRecord: ImportRecord) => void,
  formatCurrency: (amount: number) => string
): ColumnDef<ImportRecord>[] => [
  {
    accessorKey: "id",
    header: "Mã đơn hàng",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Nhà cung cấp" />;
    },
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Số lượng" />;
    },
    cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
      const quantity = getValue() as number;
      return (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span>{quantity}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Tổng tiền" />;
    },
    cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
      const amount = getValue() as number;
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "importDate",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Ngày nhập" />;
    },
    cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
      const date = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{date}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Người nhận",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-700">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Trạng thái" />;
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả trạng thái" },
          { value: "completed", label: "Hoàn thành" },
          { value: "pending", label: "Đang xử lý" },
          { value: "cancelled", label: "Đã hủy" },
        ],
      },
    },
    cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
      const status = getValue() as ImportRecord["status"];
      return (
        <Badge
          variant="secondary"
          className={`${getStatusColor(status)} w-fit`}
        >
          {getStatusLabel(status)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "actions",
    header: "Chi tiết",
    cell: ({ row }: CellContext<ImportRecord, unknown>) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewImport(row.original)}
        className="h-8 w-8 p-0 hover:bg-blue-100"
        title="Xem chi tiết"
      >
        <Eye className="w-4 h-4 text-blue-600" />
      </Button>
    ),
  },
];
