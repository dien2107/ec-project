import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Color } from "../types";

export const getColumns = (
  handleEdit: (color: Color) => void,
  handleDelete: (color: Color) => void
): ColumnDef<Color>[] => [
  {
    accessorKey: "colorId",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Mã màu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[70px] text-center">
        <span className="font-mono text-sm">{row.original.colorId}</span>
      </div>
    ),
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Tên màu" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[70px] text-center">
        <span className="font-mono text-sm">{row.original.displayName}</span>
      </div>
    ),
  },
  {
    accessorKey: "hexCode",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Mã HEX" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[100px] text-center flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: row.original.hexCode }}
        />
        <span className="font-mono text-sm">{row.original.hexCode}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <SortableHeader column={column} title="Trạng thái" />
      </div>
    ),
    // ✅ Sửa tại đây
    cell: ({ row }) => {
      const statusName = row.original.status.name;
      return (
        <div className="w-[100px] text-center">
          {statusName === "Active" && (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Hoạt động
            </div>
          )}
          {statusName === "Inactive" && (
            <div className="bg-red-200 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Không hoạt động
            </div>
          )}
          {statusName === "Draft" && (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Nháp
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="w-[100px] text-center">
        <SortableHeader column={column} title="Thao tác" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 w-[100px]">
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
