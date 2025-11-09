// columns/return-columns.tsx
import { type ColumnDef } from "@tanstack/react-table";
import {
  Package,
  Repeat2,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Hash,
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
    header: () => (
      <div className="text-left w-[100px] font-semibold text-sm text-gray-700">
        Mã phiếu
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-bold text-slate-800">{row.original.id}</span>
        </div>
        <div className="text-xs text-slate-500 pl-5">
          Đơn:{" "}
          <span className="font-medium text-slate-600">
            {row.original.orderId}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => (
      <div className="text-center w-[130px] font-semibold text-sm text-gray-700">
        Loại phiếu
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
            row.original.type === "exchange"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
              : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
          }`}
        >
          {row.original.type === "exchange" ? (
            <>
              <Repeat2 className="w-3.5 h-3.5" /> Đổi hàng
            </>
          ) : (
            <>
              <Package className="w-3.5 h-3.5" /> Trả hàng
            </>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: () => (
      <div className="text-left w-[200px] font-semibold text-sm text-gray-700">
        Khách hàng
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-slate-800 text-sm">
            {row.original.customer.name}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {row.original.customer.phone}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: () => (
      <div className="text-left w-[280px] font-semibold text-sm text-gray-700">
        Sản phẩm
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={row.original.product.image}
            alt={row.original.product.name}
            className="w-16 h-16 rounded-xl border-2 border-gray-200 object-cover shadow-md"
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
            {row.original.quantity}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-sm text-slate-800 line-clamp-2 leading-snug">
            {row.original.product.name}
          </div>
          <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-fit">
            {formatCurrency(row.original.product.price)}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => (
      <div className="text-center w-[80px] font-semibold text-sm text-gray-700">
        SL
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="bg-slate-100 text-slate-800 font-bold text-sm px-3 py-1.5 rounded-lg">
          {row.original.quantity}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-center w-[130px] font-semibold text-sm text-gray-700">
        Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig: Record<
        ReturnStatus,
        { label: string; color: string; dotColor: string }
      > = {
        pending: {
          label: "Chờ xử lý",
          color: "bg-yellow-500 text-white",
          dotColor: "bg-yellow-200",
        },
        approved: {
          label: "Đã duyệt",
          color: "bg-green-500 text-white",
          dotColor: "bg-green-200",
        },
        rejected: {
          label: "Từ chối",
          color: "bg-red-500 text-white",
          dotColor: "bg-red-200",
        },
        completed: {
          label: "Hoàn thành",
          color: "bg-blue-500 text-white",
          dotColor: "bg-blue-200",
        },
      };
      return (
        <div className="flex justify-center">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${statusConfig[status].color}`}
          >
            <div
              className={`w-2 h-2 ${statusConfig[status].dotColor} rounded-full animate-pulse`}
            ></div>
            {statusConfig[status].label}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center w-[180px] font-semibold text-sm text-gray-700">
        Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const ret = row.original;
      const isPending = ret.status === "pending";

      return (
        <div className="flex justify-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => handleView(ret)}
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`transition-colors ${
              isPending
                ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={!isPending}
            onClick={() => handleApprove(ret)}
            title="Duyệt"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`transition-colors ${
              isPending
                ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={!isPending}
            onClick={() => handleReject(ret)}
            title="Từ chối"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
