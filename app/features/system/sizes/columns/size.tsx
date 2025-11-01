import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { SizeDetailDto } from "../../../../types/product/size";

export const getColumns = (
  handleEdit: (size: SizeDetailDto) => void,
  handleDelete: (size: SizeDetailDto) => void
): ColumnDef<SizeDetailDto>[] => [
  {
    accessorKey: "sizeId",
    header: () => <div className="w-[90px] text-center">ID</div>,
    cell: ({ row }) => (
      <div className="w-[55px] text-center px-2">
        <span className="block truncate" title={row.original.sizeId.toString()}>
          {row.original.sizeId}
        </span>
      </div>
    ),
    sticky: true,
  },
  {
    accessorKey: "name",
    header: () => <div className="w-[220px] text-center">Tên kích thước</div>,
    cell: ({ row }) => (
      <div className="w-[190px] text-center px-2">
        <span className="block truncate" title={row.original.name}>
          {row.original.name}
        </span>
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
