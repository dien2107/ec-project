import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SortableHeader } from "../../components/data-table";

export type address = {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  street_address: string;
  city: string;
  ward: string;
  district: string;
  is_default: boolean;
};

export type discount = {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
};

export type shipping_method = {
  id: number;
  corp_name: string;
  base_cost: number;
};

export type payment = {
  id: number;
  order_id: number;
  payment_method: "COD" | "BANK_TRANSFER" | "CASH";
};

export type order_item = {
  id: number;
  order_id: number;
  product_variant_id: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Order = {
  id: string;
  address_id: number;
  address: address;
  discount_id: number | null;
  discount: discount | null;
  discount_amount: number;
  total_amount: number;
  is_free_ship: boolean;
  shipped_at: Date | null;
  delivery_at: Date | null;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment: payment;
  shipping_method: shipping_method;
  created_at: Date;
  updated_at: Date;
  items: order_item[];
};

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export const getColumns = (
  handleView: (order: Order) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Mã đơn"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "address.recipient_name",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Khách hàng"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày đặt"
          className="justify-start"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-start">
          {row.original.created_at.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: () => {
      return <div className="flex flex-start">Tổng tiền</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">
          {formatVND(row.getValue("total_amount"))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className="flex justify-start">Trạng thái</div>;
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "pending", label: "Chờ xử lý" },
          { value: "processing", label: "Đang giao" },
          { value: "completed", label: "Đã hoàn thành" },
          { value: "cancelled", label: "Đã hủy" },
        ],
      },
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-left">
          {status === "pending" ? (
            <div>
              <span className="bg-yellow-500 text-white text-sm font-medium py-2 px-3 rounded-2xl">
                Chờ xử lý
              </span>
            </div>
          ) : status === "completed" ? (
            <div>
              <span className="bg-green-500 text-white text-sm font-medium py-2 px-3 rounded-2xl">
                Đã giao
              </span>
            </div>
          ) : status === "cancelled" ? (
            <div>
              <span className="bg-red-500 text-white text-sm font-medium py-2 px-3 rounded-2xl">
                Đã hủy
              </span>
            </div>
          ) : (
            status === "processing" && (
              <div>
                <span className="bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-2xl">
                  Đang giao
                </span>
              </div>
            )
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      const rowValue = row.getValue(id) as string;
      return rowValue === value;
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="flex justify-end">Thao tác</div>;
    },
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="text-right">
          <Button variant="outline" onClick={() => handleView(order)}>
            <Eye />
            Xem chi tiết
          </Button>
        </div>
      );
    },
  },
];
