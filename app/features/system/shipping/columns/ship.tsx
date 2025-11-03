import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { SortableHeader } from "../../components/data-table";
import { formatVND, formatDate } from "~/libs";
import type { Ship } from "~/types/ship";
import { Switch } from "~/components/ui/switch";

export const getColumns = (
  handleEdit: (method: Ship) => void,
  handleDelete: (method: Ship) => void,
  handleToggleStatus: (method: Ship) => void,
  loadingShipId?: number | null
): ColumnDef<Ship>[] => [
  {
    accessorKey: "shipId",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px]">
          <div className="flex flex-col items-start ">
            <span>Mã</span>
            <span>vận chuyển</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="font-bold ">
          {String(row.original.shipId).padStart(3, "0")}
        </span>
      );
    },
    sticky: true,
  },
  {
    accessorKey: "corpName",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px] justify-start">
          <div className="flex flex-col items-start justify-start">
            <span>Đơn vị</span>
            <span>vận chuyển</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ getValue }) => {
      const description = getValue() as string;
      return (
        <span className="text-gray-700 max-w-xs truncate block">
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "baseCost",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px] justify-start">
          <div className="flex flex-col items-start">
            <span>Phí</span>
            <span>vận chuyển</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ getValue }) => (
      <span className="font-medium text-blue-600">
        {formatVND(getValue() as number)}
      </span>
    ),
  },
  {
    accessorKey: "estimatedDays",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px] justify-start">
          <div className="flex flex-col items-start">
            <span>Thời gian</span>
            <span>(ngày)</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ getValue }) => (
      <div className="text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {getValue() as number} ngày
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Trạng thái"
          className="w-[100px]"
        />
      );
    },
    cell: ({ row }) => {
      const original = row.original as Ship;
      const status = original.status?.name;
      const statusText = (status ?? "").toString().toLowerCase();

      const isActive = statusText === "active";

      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} title="Ngày tạo" className="w-[80px]">
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>tạo</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.original.createdAt;
      const dateObj = new Date(dateStr);
      return (
        <div className="text-center text-gray-400">
          {dateObj.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày cập nhật"
          className="w-[80px]"
        >
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>cập nhật</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.original.updatedAt;
      const dateObj = new Date(dateStr);
      return (
        <div className="text-center text-gray-400">
          {dateObj.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const ship = row.original as Ship;
      const isActive = ship.status?.name?.toLowerCase() === "active";
      const canDelete = row.original.canDelete;
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={() => handleToggleStatus(ship)}
            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
            disabled={loadingShipId === ship.shipId || isActive}
          />
          {loadingShipId === ship.shipId && (
            <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(ship)}
            className="h-8 w-8 p-0 hover:bg-green-100"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(ship)}
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
