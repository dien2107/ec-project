import { Eye, Edit, Trash2 } from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { SortableHeader } from "../../components/data-table";

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: "active" | "inactive";
  createdDate: string;
}
export interface EditCategoryDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  category: Category | null;
  onSave: (categoryData: Partial<Category>) => void;
}
export interface DeleteCategoryDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  category: Category | null;
  onDelete: (categoryId: string) => void;
}

export interface CategoryDetailDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  category: Category | null;
}

export interface AddCategoryDialogProps {
  onSave: (categoryData: Partial<Category>) => void;
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
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Trạng thái"
          className="w-[100px]"
        />
      );
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Không hoạt động" },
        ],
      },
    },
    cell: ({ row }) => {
      return (
        <div className="w-[100px] text-center">
          {row.original.status ? (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Hoạt động
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Không hoạt động
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      const rowValue = row.getValue(id) ? "active" : "inactive";
      return rowValue === value;
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
