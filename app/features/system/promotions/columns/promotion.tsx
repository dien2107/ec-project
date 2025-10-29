import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Discount } from "../types";
import { formatVND } from "~/libs";
import {
  ArrowUpDown,
  ChevronUp,
  SquarePen,
  Trash,
  TicketPercent,
  Banknote,
} from "lucide-react";

export const getColumns = (
  handleEdit: (discount: Discount) => void,
  handleDelete: (discount: Discount) => void
): ColumnDef<Discount>[] => [
  // --- Cột 1: Mã giảm giá + Mô tả (Kết hợp) ---
  {
    accessorKey: "code",
    header: ({ column }) => (
      <div className="w-[180px] text-left">
        <SortableHeader column={column} title="Mã & Mô tả" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-start px-2">
        <span className="font-medium">{row.original.code}</span>
        <span className="text-xs text-gray-500">
          {row.original.description}
        </span>
      </div>
    ),
  },

  // --- Cột 2: Loại giảm giá ---
  {
    accessorKey: "discountType",
    header: ({ column }) => (
      // GIỮ NGUYÊN STYLE HEADER CŨ VỚI SortableHeader
      <div className="w-[130px] text-center">
        <SortableHeader column={column} title="Loại" />
      </div>
    ),
    cell: ({ row }) => {
      // SỬ DỤNG LOGIC ICON TỪ BẢN ĐẦY ĐỦ
      return (
        <div className="flex justify-center w-[100px]">
          {row.original.discountType === "percentage" ? (
            <TicketPercent className="text-blue-500" />
          ) : (
            <Banknote className="text-green-600" />
          )}
        </div>
      );
    },
  },

  // --- Cột 3: Giá trị ---
  {
    accessorKey: "discountValue",
    header: ({ column }) => (
      <div className="w-[160px] text-center">
        <SortableHeader column={column} title="Giá trị" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[100px] text-right pr-2">
        {row.original.discountType === "percentage"
          ? `${row.original.discountValue}%`
          : formatVND(row.original.discountValue)}
      </div>
    ),
  },

  // --- Cột 4: Giảm tối đa ---
  {
    accessorKey: "maxDiscountAmount",
    header: ({ column }) => (
      <div className="w-[200px] text-center">
        <SortableHeader column={column} title="Giảm tối đa" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[140px] text-right pr-2">
        {formatVND(row.original.maxDiscountAmount)}
      </div>
    ),
  },

  // --- Cột 5: Đơn tối thiểu ---
  {
    accessorKey: "minOrderAmount",
    header: ({ column }) => (
      <div className="w-[140px] text-center">
        <SortableHeader column={column} title="Đơn tối thiểu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[110px] text-right pr-2">
        {formatVND(row.original.minOrderAmount)}
      </div>
    ),
  },

  // --- Cột 6: Giới hạn sử dụng ---
  {
    accessorKey: "usedCount",
    header: ({ column }) => (
      <div className="w-[220px] text-center">
        <SortableHeader column={column} title="Đã dùng/Giới hạn" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[180px] text-center">
        {row.original.usedCount}/{row.original.usageLimit}
      </div>
    ),
  },

  // --- Cột 7: Ngày bắt đầu ---
  {
    accessorKey: "startAt",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Bắt đầu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[90px] text-center">
        {new Date(row.original.startAt).toLocaleDateString("en-GB")}
      </div>
    ),
  },

  // --- Cột 8: Ngày kết thúc ---
  {
    accessorKey: "endAt",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Kết thúc" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[90px] text-center">
        {new Date(row.original.endAt).toLocaleDateString("en-GB")}
      </div>
    ),
  },

  // --- Cột 9: Trạng thái (Giữ logic cũ, thêm trạng thái 'Expired' và căn chỉnh) ---
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Trạng thái" />
      </div>
    ),
    cell: ({ row }) => {
      // Giả định status.name theo kiểu dữ liệu bạn đã sử dụng trước đó
      const statusName = row.original.status.name;
      let bgColor = "bg-gray-200";
      let textColor = "text-gray-400";
      let label = "Nháp";

      if (statusName === "Active") {
        bgColor = "bg-green-400";
        textColor = "text-white";
        label = "Hoạt động";
      } else if (statusName === "Inactive") {
        bgColor = "bg-red-400";
        textColor = "text-white";
        label = "Ngừng áp dụng";
      } else if (statusName === "Expired") {
        // Thêm trạng thái Hết hạn
        bgColor = "bg-gray-400";
        textColor = "text-white";
        label = "Hết hạn";
      }

      return (
        <div className="w-[90px] text-center">
          <div
            className={`${bgColor} ${textColor} py-1 px-2 rounded-lg text-center whitespace-normal break-words inline-block`}
          >
            {label}
          </div>
        </div>
      );
    },
  },

  // --- Cột 10: Thao tác (Giữ nguyên style) ---
  {
    id: "actions",
    header: ({ column }) => (
      <div className="w-[110px] text-center">
        <SortableHeader column={column} title="Thao tác" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 w-[80px] justify-center">
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
