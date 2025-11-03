import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { CategoryDetailDto } from "../../../../types/product/category";

export const getColumns = (
  handleEdit: (category: CategoryDetailDto) => void,
  handleDelete: (category: CategoryDetailDto) => void
): ColumnDef<CategoryDetailDto>[] => [
  {
    accessorKey: "categoryId",
    header: () => <div className="w-[90px] text-center">ID</div>,
    cell: ({ row }) => (
      <div className="w-[55px] text-center px-2">
        <span
          className="block truncate"
          title={row.original.categoryId.toString()}
        >
          {row.original.categoryId}
        </span>
      </div>
    ),
    sticky: true,
  },
  {
    accessorKey: "name",
    header: () => <div className="w-[200px] text-center">Tên thể loại</div>,
    cell: ({ row }) => (
      <div className="w-[180px] text-center px-2">
        <span className="block truncate" title={row.original.name}>
          {row.original.name}
        </span>
        <span className="text-xs text-gray-400">{row.original.slug}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="w-[240px] text-center">Mô tả</div>,
    cell: ({ row }) => (
      <div className="w-[220px] text-center px-2">
        <span className="block truncate" title={row.original.description}>
          {row.original.description || ""}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "sizeDetail",
    header: () => (
      <div className="text-center w-[140px]">Ảnh chi tiết kích thước</div>
    ),
    cell: ({ row }) => {
      const imageUrl = row.original.sizeDetail;
      return (
        <div className="flex justify-center items-center w-[120px] h-[80px] mx-auto">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Ảnh chi tiết kích thước"
              className="object-cover rounded-md w-12 h-12 border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<span class="text-xs text-gray-400">Ảnh lỗi</span>';
                }
              }}
            />
          ) : (
            <span className="text-xs text-gray-400">Không có ảnh</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "parentName",
    header: () => <div className="w-[180px] text-center">Thể loại cha</div>,
    cell: ({ row }) => (
      <div className="w-[160px] text-center px-2">
        <span
          className="block truncate"
          title={row.original.parentName || "Thể loại gốc"}
        >
          {row.original.parentName || "Thể loại gốc"}
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
      <div className="w-[175px] text-center font-medium text-gray-700">
        Thao tác
      </div>
    ),
    cell: ({ row }) => {
      const { status, categoryId } = row.original;
      const isDeletable = status.name === "Inactive";

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
