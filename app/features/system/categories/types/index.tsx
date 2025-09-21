import { Eye, Edit, Trash2 } from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: "active" | "inactive";
  createdDate: string;
}

export const getColumns = (
  handleView: (category: Category) => void,
  handleEdit: (category: Category) => void,
  handleDelete: (category: Category) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "Mã danh mục",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên danh mục",
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
        <span className="text-gray-600 max-w-xs truncate block">
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "productCount",
    header: "Số sản phẩm",
    cell: ({ getValue }) => (
      <span className="text-center block">{getValue() as number}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }: CellContext<Category, unknown>) => {
      const status = getValue() as Category["status"];
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={
            status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: "Ngày tạo",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }: CellContext<Category, unknown>) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleView(row.original)}
          className="h-8 w-8 p-0 hover:bg-blue-100"
          title="Xem chi tiết"
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button>
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
