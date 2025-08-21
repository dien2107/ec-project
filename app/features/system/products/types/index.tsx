import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SquarePen, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";

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
};

export const getColumns = (
  handleEdit: (product: Product) => void,
  handleDelete: (product: Product) => void
): ColumnDef<Product>[] => [
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
  },
  {
    accessorKey: "slug",
    header: "Slug",
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
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Không hoạt động" },
        ],
      },
    },
    cell: ({ row }) => (row.original.status ? "Hoạt động" : "Không hoạt động"),
    filterFn: (row, id, value) => {
      if (!value) return true;
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
    cell: ({ row }) => row.original.created_at.toLocaleDateString(),
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
