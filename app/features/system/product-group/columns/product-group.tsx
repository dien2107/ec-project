import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ProductGroupDetailDto } from "../../../../types/product/product-group";

export const getColumns = (
  handleEdit: (item: ProductGroupDetailDto) => void,
  handleDelete: (item: ProductGroupDetailDto) => void
): ColumnDef<ProductGroupDetailDto>[] => [
  {
    accessorKey: "productGroupId",
    header: () => (
      <div className="w-[120px] text-center font-medium text-gray-700">ID</div>
    ),
    cell: ({ row }) => (
      <div className="w-[90px] text-center px-2">
        <span
          className="block truncate text-sm text-gray-900"
          title={row.original.productGroupId}
        >
          {row.original.productGroupId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="w-[200px] text-center font-medium text-gray-700">
        Tên nhóm sản phẩm
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[180px] text-center px-2">
        <span
          className="block truncate text-sm text-gray-900"
          title={row.original.name}
        >
          {row.original.name}
        </span>
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
      <div className="w-[130px] text-center text-sm text-gray-900">
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
      <div className="w-[150px] text-center text-sm text-gray-900">
        {new Date(row.original.updatedAt).toLocaleDateString("en-GB")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="w-[140px] text-center font-medium text-gray-700">
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
        <div className="w-[120px] text-center">
          <div
            className={`${statusClass} text-white py-1 px-2 rounded-lg text-center whitespace-nowrap`}
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
      <div className="w-[100px] text-center font-medium text-gray-700">
        Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const isDeletable = row.original.status.name === "Inactive";

      return (
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
