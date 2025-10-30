import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Color, ColorDetailDto } from "../../../../types/product/color";

export const getColumns = (
  handleEdit: (color: ColorDetailDto) => void,
  handleDelete: (color: ColorDetailDto) => void
): ColumnDef<ColorDetailDto>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="w-[110px] text-center">
        <div className="text-center font-medium w-full">Tên màu sắc</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[70px] text-center">
        <span className="font-mono text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => (
      <div className="w-[110px] text-center">
        <div className="text-center font-medium w-full">Tên hiển thị</div>
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
        <div className="text-center font-medium w-full">Mã HEX</div>
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="w-[150px] text-center">
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
      <div className="w-[150px] text-center">
        {new Date(row.original.updatedAt).toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="w-[120px] text-center">
        <div className="text-center font-medium w-full">Trạng thái</div>
      </div>
    ),
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
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="w-[100px] text-center">
        <div className="text-center font-medium w-full">Thao tác</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 w-[70px] justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(row.original)}
          className="h-8 w-8 p-0 hover:bg-green-100"
          title="Chỉnh sửa"
        >
          <Edit className="h-4 w-4 text-green-600" />
        </Button>
        {row.original.status.name === "Inactive" && (
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
    ),
  },
];
