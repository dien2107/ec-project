import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { DiscountDetailDto } from "~/types/discounts";
import { formatVND } from "~/libs";
import { TicketPercent, Banknote } from "lucide-react";

export const getColumns = (
  handleEdit: (discount: DiscountDetailDto) => void,
  handleDelete: (discount: DiscountDetailDto) => void
): ColumnDef<DiscountDetailDto>[] => [
  // --- Cột 1: ID ---
  {
    accessorKey: "discountId",
    header: () => <div className="w-[80px] text-center">ID</div>,
    cell: ({ row }) => (
      <div className="w-[50px] text-center px-2">
        <span
          className="block truncate"
          title={row.original.discountId.toString()}
        >
          {row.original.discountId}
        </span>
      </div>
    ),
    sticky: true,
  },

  // --- Cột 2: Mã giảm giá + Mô tả ---
  {
    accessorKey: "code",
    header: () => <div className="w-[200px] text-center">Mã & Mô tả</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-start px-2 w-[180px]">
        <span className="font-medium truncate w-full" title={row.original.code}>
          {row.original.code}
        </span>
        <span
          className="text-xs text-gray-500 truncate w-full"
          title={row.original.description || ""}
        >
          {row.original.description || ""}
        </span>
      </div>
    ),
  },

  // --- Cột 3: Loại giảm giá ---
  {
    accessorKey: "discountType",
    header: () => <div className="w-[100px] text-center">Loại</div>,
    cell: ({ row }) => (
      <div className="flex justify-center w-[70px]">
        {row.original.discountType === "percentage" ? (
          <TicketPercent className="text-blue-500" size={30} />
        ) : (
          <Banknote className="text-green-600" size={30} />
        )}
      </div>
    ),
  },

  // --- Cột 4: Giá trị ---
  {
    accessorKey: "discountValue",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Giá trị" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[80px] text-right pr-2">
        {row.original.discountType === "percentage"
          ? `${row.original.discountValue}%`
          : formatVND(row.original.discountValue)}
      </div>
    ),
  },

  // --- Cột 5: Giảm tối đa ---
  {
    accessorKey: "maxDiscountAmount",
    header: ({ column }) => (
      <div className="w-[140px] text-center">
        <SortableHeader column={column} title="Giảm tối đa" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[110px] text-right pr-2">
        {row.original.maxDiscountAmount
          ? formatVND(row.original.maxDiscountAmount)
          : "-"}
      </div>
    ),
  },

  // --- Cột 6: Đơn tối thiểu ---
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

  // --- Cột 7: Đã dùng/Giới hạn ---
  {
    accessorKey: "usedCount",
    header: ({ column }) => (
      <div className="w-[170px] text-center">
        <SortableHeader column={column} title="Đã dùng/Giới hạn" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[130px] text-center">
        {row.original.usedCount}/{row.original.usageLimit ?? "∞"}
      </div>
    ),
  },

  // --- Cột 8: Ngày bắt đầu ---
  {
    accessorKey: "startAt",
    header: ({ column }) => (
      <div className="w-[150px] text-center">
        <SortableHeader column={column} title="Bắt đầu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[110px] text-center">
        {row.original.startAt
          ? new Date(row.original.startAt).toLocaleDateString("en-GB")
          : "-"}
      </div>
    ),
  },

  // --- Cột 9: Ngày kết thúc ---
  {
    accessorKey: "endAt",
    header: ({ column }) => (
      <div className="w-[140px] text-center">
        <SortableHeader column={column} title="Kết thúc" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[110px] text-center">
        {row.original.endAt
          ? new Date(row.original.endAt).toLocaleDateString("en-GB")
          : "-"}
      </div>
    ),
  },

  // --- Cột 10: Trạng thái ---
  {
    accessorKey: "status",
    header: () => (
      <div className="w-[130px] text-center font-medium text-gray-700">
        Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      if (!status) {
        return (
          <div className="w-[110px] text-center">
            <div className="bg-gray-300 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Không xác định
            </div>
          </div>
        );
      }

      const { name, displayName } = status;

      const statusColorMap: Record<string, string> = {
        Active: "bg-green-400 text-white",
        Inactive: "bg-red-300 text-white",
        Expired: "bg-gray-400 text-white",
      };

      const statusClass = statusColorMap[name] || "bg-gray-300 text-white";

      return (
        <div className="w-[110px] text-center">
          <div
            className={`${statusClass} py-1 px-2 rounded-lg text-center whitespace-normal break-words`}
            title={displayName || name}
          >
            {displayName || name}
          </div>
        </div>
      );
    },
  },

  // --- Cột 11: Thao tác ---
  {
    id: "actions",
    header: () => (
      <div className="w-[120px] text-center font-medium text-gray-700">
        Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const discount = row.original;

      const now = new Date();
      const endAt = discount.endAt ? new Date(discount.endAt) : null;

      // Điều kiện cho phép chỉnh sửa
      const canEdit = !endAt || now <= endAt;

      // Điều kiện cho phép xóa
      const canDelete =
        discount.status?.name === "Inactive" && discount.usedCount === 0;

      return (
        <div className="flex gap-2 justify-center w-[100px]">
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(discount)}
              className="h-8 w-8 p-0 hover:bg-green-100"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
          )}

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(discount)}
              className="h-8 w-8 p-0 hover:bg-red-100"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];
