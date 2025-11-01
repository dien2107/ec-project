import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ColorDetailDto } from "../../../../types/product/color";

export const getColumns = (
  handleEdit: (color: ColorDetailDto) => void,
  handleDelete: (color: ColorDetailDto) => void
): ColumnDef<ColorDetailDto>[] => [
  {
    accessorKey: "colorId",
    header: () => <div className="w-[100px] text-center">ID</div>,
    cell: ({ row }) => (
      <div className="w-[65px] text-center px-2">
        <span
          className="block truncate"
          title={row.original.colorId.toString()}
        >
          {row.original.colorId}
        </span>
      </div>
    ),
    sticky: true,
  },
  {
    accessorKey: "name",
    header: () => <div className="w-[200px] text-center">Tên màu sắc</div>,
    cell: ({ row }) => (
      <div className="w-[165px] text-center px-2">
        <span className="block truncate" title={row.original.name}>
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "displayName",
    header: () => <div className="w-[220px] text-center">Tên hiển thị</div>,
    cell: ({ row }) => (
      <div className="w-[190px] text-center px-2">
        <span className="block truncate" title={row.original.displayName}>
          {row.original.displayName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "hexCode",
    header: () => <div className="w-[120px] text-center">Mã HEX</div>,
    cell: ({ row }) => (
      <div className="w-[100px] text-center flex items-center gap-2 px-2">
        <div
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: row.original.hexCode }}
        />
        <span className="font-mono text-sm">{row.original.hexCode}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="w-[155px] text-center">
        <SortableHeader column={column} title="Ngày tạo" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[130px] text-center">
        {new Date(row.original.createdAt).toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <div className="w-[150px] text-center">
        <SortableHeader column={column} title="Ngày cập nhật" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[155px] text-center">
        {new Date(row.original.updatedAt).toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="w-[130px] text-center font-medium text-gray-700">
        Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const { name, displayName } = row.original.status;

      const statusColorMap: Record<string, string> = {
        Active: "bg-green-400 text-white",
        Inactive: "bg-red-300 text-white",
      };

      const statusClass = statusColorMap[name] || "bg-gray-300 text-white";

      return (
        <div className="w-[100px] text-center">
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
  {
    id: "actions",
    header: () => (
      <div className="w-[175px] text-center font-medium text-gray-700">
        Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const isDeletable = row.original.status.name === "Inactive";

      return (
        <div className="flex gap-2 justify-center w-[150px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0 hover:bg-green-100"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>

          {isDeletable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original)}
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
