import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Eye } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import { formatVND } from "~/libs";

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
export const statusMap: Record<
  Status["name"],
  { label: string; color: string }
> = {
  Draft: { label: "Chờ xử lý", color: "bg-yellow-400" },
  Pending: { label: "Đang chờ xác nhận", color: "bg-amber-500" },
  Confirmed: { label: "Đã xác nhận", color: "bg-teal-500" },
  Processing: { label: "Đang giao", color: "bg-blue-500" },
  Delivered: { label: "Đã giao", color: "bg-green-500" },
  Cancelled: { label: "Đã hủy", color: "bg-red-500" },
  Returned: { label: "Đã hoàn trả", color: "bg-gray-500" },
  Shipped: { label: "Đã gửi hàng", color: "bg-purple-500" },
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
type Status = {
  statusId: number;
  name:
    | "Draft"
    | "Pending"
    | "Confirmed"
    | "Processing"
    | "Delivered"
    | "Cancelled"
    | "Returned"
    | "Shipped";
};
type User = {
  userId: number;
  fullName: string;
};
type Ship = {
  shipId: number;
  corpName: string;
};
export type Order = {
  orderId: number;
  address_id: number;
  address: address;
  addressInfo: string;
  discount_id: number | null;
  discount: discount | null;
  discount_amount: number;
  total_amount: number;
  is_free_ship: boolean;
  shipped_at: Date | null;
  ship: Ship;
  delivery_at: Date | null;
  user: User;
  status: Status;
  payment: payment;
  shipping_method: shipping_method;
  createdAt: Date;
  updatedAt: Date;
  items: order_item[];
};

export const getColumns = (
  handleView: (order: Order) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <SortableHeader column={column} title="Mã đơn" className="text-center" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-700">
        #{row.original.orderId}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Khách hàng"
        className="text-center"
      />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="text-center font-semibold text-gray-800">
          {user.fullName}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Ngày đặt"
        className="text-center"
      />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);
      return (
        <div className="text-center text-gray-600">
          {createdAt.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-center font-semibold">Tổng tiền</div>,
    cell: ({ row }) => (
      <div className="text-center font-bold text-green-600">
        {formatVND(row.getValue("totalAmount"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">Trạng thái</div>,
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
      const status = row.original.status as Status;

      const info = statusMap[status.name] || {
        label: "Không xác định",
        color: "bg-gray-400",
      };

      return (
        <div className="flex justify-center">
          <span
            className={`${info.color} text-white text-xs md:text-sm font-medium py-1.5 px-3 rounded-full shadow-sm`}
          >
            {info.label}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      const rowValue = (row.getValue(id) as Status).name?.toLowerCase();
      return rowValue === value.toLowerCase();
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center font-semibold">Thao tác</div>,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => {
              console.log(order);
              handleView(order);
            }}
          >
            <Eye className="h-4 w-4" />
            <span>Xem chi tiết</span>
          </Button>
        </div>
      );
    },
  },
];
