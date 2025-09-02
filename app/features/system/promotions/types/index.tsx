import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronUp,
  SquarePen,
  Trash,
  TicketPercent,
  Banknote,
} from "lucide-react";
import { Button } from "~/components/ui/button";

export type Promotion = {
  discount_id: number;
  code: string;
  description: string;
  discount_type: "percentage" | "amount";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  used_count: number;
  start_at: Date;
  end_at: Date;
  status: "active" | "inactive" | "expired";
  created_at: Date;
  updated_at: Date;
};

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const getColumns = (
  handleEdit: (promotion: Promotion) => void,
  handleDelete: (promotion: Promotion) => void
): ColumnDef<Promotion>[] => [
  // {
  //   accessorKey: "discount_id",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Mã giảm giá
  //         <ArrowUpDown className="h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return <div className="text-left">PROMO-{row.original.discount_id}</div>;
  //   },
  // },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên mã
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    meta: {
      filterConfig: {
        type: "text",
        placeholder: "Tìm kiếm mã giảm giá...",
      },
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.code}</span>
          <span className="text-xs text-gray-400">
            {row.original.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "discount_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[60px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loại
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Loại",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "percentage", label: "Phần trăm" },
          { value: "amount", label: "Số tiền" },
        ],
      },
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.discount_type == "percentage" ? (
            <TicketPercent className="text-blue-500" />
          ) : (
            <Banknote className="text-green-600" />
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "discount_value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá trị
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {row.original.discount_type == "percentage"
            ? row.original.discount_value + "%"
            : formatVND(row.original.discount_value)}
        </div>
      );
    },
  },
  {
    accessorKey: "max_discount_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[80px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex flex-col items-start p-1">
            <span>Giảm</span>
            <span>tối đa</span>
          </div>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatVND(row.original.max_discount_amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "min_order_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[100px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex flex-col items-start p-1">
            <span>Đơn</span>
            <span>tối thiểu</span>
          </div>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatVND(row.original.min_order_amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "used_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[60px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex flex-col items-start p-1">
            <span>Giới</span>
            <span>hạn</span>
          </div>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.used_count}/{row.original.usage_limit}
        </div>
      );
    },
  },
  {
    accessorKey: "start_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[90px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>bắt đầu</span>
          </div>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {new Date(row.original.start_at).toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "end_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[90px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>kết thúc</span>
          </div>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {new Date(row.original.end_at).toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-[80px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex flex-col items-start">
            <span>Trạng</span>
            <span>thái</span>
          </div>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "active", label: "Còn hạn" },
          { value: "inactive", label: "Hết hạn" },
          { value: "expired", label: "Ngừng áp dụng" },
        ],
      },
    },
    cell: ({ row }) => {
      return (
        <div className="w-[80px] text-center">
          {row.original.status === "active" ? (
            <div className="bg-green-400 text-white py-1 px-1 rounded-lg whitespace-normal break-words">
              Còn hạn
            </div>
          ) : row.original.status === "inactive" ? (
            <div className="bg-gray-200 text-gray-400 py-1 px-1 rounded-lg whitespace-normal break-words">
              Hết hạn
            </div>
          ) : (
            <div className="bg-red-400 text-white py-1 px-1 rounded-lg whitespace-normal break-words">
              Ngừng áp dụng
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return <div className="flex justify-end px-4">Thao tác</div>;
    },
    cell: ({ row }) => {
      const promotion = row.original;

      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleEdit(promotion)}>
            <SquarePen />
          </Button>
          <Button
            variant="outline"
            color="destructive"
            onClick={() => handleDelete(promotion)}
          >
            <Trash stroke="red" />
          </Button>
        </div>
      );
    },
  },
];
