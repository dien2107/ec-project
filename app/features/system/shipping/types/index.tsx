import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { SortableHeader } from "../../components/data-table";

export interface ShippingMethod {
  id: string;
  corpName: string;
  description: string;
  baseCost: number;
  estimatedDays: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const getColumns = (
  handleEdit: (method: ShippingMethod) => void,
  handleDelete: (method: ShippingMethod) => void
): ColumnDef<ShippingMethod>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Mã vận chuyển" />;
    },
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "corpName",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Đơn vị vận chuyển" />;
    },
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ getValue }) => {
      const description = getValue() as string;
      return (
        <span className="text-gray-700 max-w-xs truncate block">
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "baseCost",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Phí vận chuyển" />;
    },
    cell: ({ getValue }) => (
      <span className="font-medium text-blue-600">
        {formatCurrency(getValue() as number)}
      </span>
    ),
  },
  {
    accessorKey: "estimatedDays",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Thời gian (ngày)" />;
    },
    cell: ({ getValue }) => (
      <div className="text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {getValue() as number} ngày
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Trạng thái"
          className="w-[100px]"
        />
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả trạng thái" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Không hoạt động" },
        ],
      },
    },
    cell: ({ getValue }) => {
      const status = getValue() as ShippingMethod["status"];
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={
            status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
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
