import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableHeader } from "../../components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "../types"; // Thay đổi đường dẫn nếu cần

export const getColumns = (
  handleEdit: (category: Category) => void,
  handleDelete: (category: Category) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "categoryId",
    header: ({ column }) => (
      <div className="w-[140px] text-center">
        <SortableHeader column={column} title="Mã danh mục" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[100px] text-center">
        <span className="font-mono text-sm">{row.original.categoryId}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="w-[150px] text-center">
        <div className="text-center font-medium w-full">Tên danh mục</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[120px] text-center">
        <span className="font-mono text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <div className="w-[300px] text-center">
        <div className="text-center font-medium w-full">Mô tả</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[300px] text-center">
        <span className="font-mono text-sm">{row.original.description}</span>
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
      <div className="w-[115px] text-center">
        <div className="text-center font-medium w-full">Trang thái</div>
      </div>
    ),
    cell: ({ row }) => {
      const statusName = row.original.status.name;
      return (
        <div className="w-[90px] text-center">
          {statusName === "Active" && (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg">
              Hoạt động
            </div>
          )}
          {statusName === "Inactive" && (
            <div className="bg-red-200 text-white py-1 px-2 rounded-lg">
              Không hoạt động
            </div>
          )}
          {statusName === "Draft" && (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg">
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
        <div className="text-center font-medium w-full">Thao tác</div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
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
