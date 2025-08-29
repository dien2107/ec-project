import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronUp, SquarePen, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";

export type ProductVariant = {
  product_variant_id: number;
  color_id: number;
  color_name: string;
  code_hex: string;
  size_id: number;
  size_name: string;
  stock_quantity: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  material_id: number;
  category_id: number;
  base_price: number;
  sale_price: number;
  discount_percent: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  product_variant: ProductVariant[];
};

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const getColumns = (
  handleEdit: (product: Product) => void,
  handleDelete: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    id: "expander",
    header: "",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronUp className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <ChevronUp className="h-4 w-4 rotate-180 transition-transform duration-200" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      filterConfig: {
        type: "text",
        placeholder: "Tìm tên sản phẩm...",
      },
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-gray-400">{row.original.slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "base_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá cơ bản
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">{formatVND(row.original.base_price)}</div>
      );
    },
  },
  {
    accessorKey: "sale_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá giảm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.discount_percent > 0 ? (
            <div className="flex flex-col">
              <div className="text-right font-medium">
                {formatVND(row.original.sale_price)}
              </div>
              <div className="text-right line-through text-gray-400">
                {formatVND(row.original.base_price)}
              </div>
            </div>
          ) : (
            <div className="text-right font-medium">
              {formatVND(row.original.sale_price)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "discount_percent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giảm giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex m-auto">
          {row.original.discount_percent > 0 ? (
            <div className="inline-block mx-auto min-w-12 py-1 px-2 bg-[#EF4444] rounded-lg text-white text-center">
              {row.original.discount_percent}%
            </div>
          ) : (
            <div className="inline-block mx-auto min-w-12 py-1 px-2 bg-gray-200 rounded-lg text-gray-400 text-center">
              0%
            </div>
          )}
        </div>
      );
    },
  },
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
    cell: ({ row }) => {
      return (
        <div>
          {row.original.status ? (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg text-center">
              Hoạt động
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center">
              Không hoạt động
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      const rowValue = row.getValue(id) ? "active" : "inactive";
      return rowValue === value;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center text-gray-400">
          {row.original.created_at.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleEdit(product)}>
            <SquarePen />
          </Button>
          <Button
            variant="outline"
            color="destructive"
            onClick={() => handleDelete(product)}
          >
            <Trash stroke="red" />
          </Button>
        </div>
      );
    },
  },
];
