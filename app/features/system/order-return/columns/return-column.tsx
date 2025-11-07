// columns/return-columns.tsx
import { type ColumnDef } from "@tanstack/react-table";
import {
  Package,
  Repeat2,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Printer,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Return, ReturnType, ReturnStatus } from "../types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export const getReturnColumns = (
  handleView: (ret: Return) => void,
  handleApprove: (ret: Return) => void,
  handleReject: (ret: Return) => void
): ColumnDef<Return>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-left w-[100px]">Mã phiếu</div>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="font-semibold text-slate-800">{row.original.id}</div>
        <div className="text-xs text-slate-500">
          Đơn: {row.original.orderId}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center w-[120px]">Loại</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            row.original.type === "exchange"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {row.original.type === "exchange" ? (
            <>
              <Repeat2 className="w-4 h-4 mr-1" /> Đổi hàng
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-1" /> Trả hàng
            </>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: () => <div className="text-left w-[180px]">Khách hàng</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-medium text-slate-800 text-sm">
            {row.original.customer.name}
          </div>
          <div className="text-xs text-slate-500">
            {row.original.customer.phone}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: () => <div className="text-left w-[250px]">Sản phẩm</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.product.image}
          alt={row.original.product.name}
          className="w-10 h-10 rounded border object-cover"
        />
        <div>
          <div className="font-medium text-sm">{row.original.product.name}</div>
          <div className="text-xs text-slate-500">
            {row.original.product.sku}
          </div>
          <div className="text-xs font-medium text-green-600">
            {formatCurrency(row.original.product.price)}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-center w-[80px]">SL</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium text-slate-800">
        {row.original.quantity}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center w-[120px]">Trạng thái</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig: Record<
        ReturnStatus,
        { label: string; color: string }
      > = {
        pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
        processing: {
          label: "Đang xử lý",
          color: "bg-blue-100 text-blue-800",
        },
        approved: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
        rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
        draft: { label: "Nháp", color: "bg-gray-100 text-gray-800" },
      };
      return (
        <div className="flex justify-center">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}
          >
            {statusConfig[status].label}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right w-[200px] pr-4">Thao tác</div>,
    cell: ({ row }) => {
      const ret = row.original;
      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log(ret);
              handleView(ret);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            disabled={ret.status !== "pending"}
            onClick={() => handleApprove(ret)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={ret.status !== "pending"}
            onClick={() => handleReject(ret)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
