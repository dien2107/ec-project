import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Eye } from "lucide-react";
import { SortableHeader } from "../../components/data-table";

export const getColumns = (
  onViewProduct: (product: Product) => void,
  onUpdateStock: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} title="Id" className="justify-start" />
      );
    },
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Tên sản phẩm"
          className="justify-start"
        />
      );
    },
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-gray-900">{row.original.name}</p>
        <p className="text-sm text-gray-500">{row.original.brand}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: () => {
      return <div className="p-4">Danh mục</div>;
    },
    cell: ({ row }) => (
      <Badge variant="secondary" className="just">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "currentStock",
    header: () => {
      return <div className="p-4">Số lượng</div>;
    },
    cell: ({ row }) => {
      const product = row.original;
      const percentage = (product.currentStock / product.maxStock) * 100;
      const getStockBarColor = (percentage: number) => {
        if (percentage > 50) return "bg-green-500";
        if (percentage > 20) return "bg-yellow-500";
        return "bg-red-500";
      };

      return (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>
              {product.currentStock} / {product.maxStock}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getStockBarColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Trạng thái"
          className="w-[100px] justify-start"
        />
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "in_stock", label: "Còn hàng" },
          { value: "out_of_stock", label: "Hết hàng" },
        ],
      },
    },
    cell: ({ row }) => {
      return (
        <div className="w-[100px] text-center">
          {row.original.status === "in_stock" ? (
            <Badge variant="default">Còn hàng</Badge>
          ) : (
            <Badge variant="destructive">Hết hàng</Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      const rowValue = row.getValue(id) ? "in_stock" : "out_of_stock";
      return rowValue === value;
    },
  },

  {
    accessorKey: "lastUpdated",
    header: "Cập nhật cuối",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.lastUpdated}</span>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProduct(row.original)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateStock(row.original)}
          className="text-xs"
        >
          Cập nhật kho
        </Button>
      </div>
    ),
  },
];
