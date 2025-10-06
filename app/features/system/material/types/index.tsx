import { Edit, Trash2, Star } from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { SortableHeader } from "../../components/data-table";

export interface Material {
  id: string;
  name: string;
  type:
    | "cotton"
    | "polyester"
    | "silk"
    | "wool"
    | "linen"
    | "denim"
    | "leather"
    | "synthetic";
  description: string;
  composition: string;
  careInstructions: string;
  durability: number; // 1-10 scale
  breathability: number; // 1-10 scale
  comfort: number; // 1-10 scale
  status: "active" | "inactive";
  createdDate: string;
}

const getMaterialTypeLabel = (type: Material["type"]) => {
  switch (type) {
    case "cotton":
      return "Cotton";
    case "polyester":
      return "Polyester";
    case "silk":
      return "Silk";
    case "wool":
      return "Wool";
    case "linen":
      return "Linen";
    case "denim":
      return "Denim";
    case "leather":
      return "Leather";
    case "synthetic":
      return "Synthetic";
    default:
      return type;
  }
};

const getMaterialTypeColor = (type: Material["type"]) => {
  switch (type) {
    case "cotton":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "polyester":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "silk":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "wool":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "linen":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "denim":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
    case "leather":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "synthetic":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};
export const getColumns = (
  handleEdit: (material: Material) => void,
  handleDelete: (material: Material) => void
): ColumnDef<Material>[] => [
  {
    accessorKey: "id",
    header: "Mã chất liệu",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Tên chất liệu" />;
    },
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Loại" />;
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Loại chất liệu",
        options: [
          { value: "all", label: "Tất cả loại" },
          { value: "cotton", label: "Cotton" },
          { value: "polyester", label: "Polyester" },
          { value: "silk", label: "Silk" },
          { value: "wool", label: "Wool" },
          { value: "linen", label: "Linen" },
          { value: "denim", label: "Denim" },
          { value: "leather", label: "Leather" },
          { value: "synthetic", label: "Synthetic" },
        ],
      },
    },
    cell: ({ getValue }: CellContext<Material, unknown>) => {
      const type = getValue() as Material["type"];
      return (
        <Badge
          variant="secondary"
          className={`${getMaterialTypeColor(type)} w-fit`}
        >
          {getMaterialTypeLabel(type)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "composition",
    header: "Thành phần",
    cell: ({ getValue }) => {
      const composition = getValue() as string;
      return (
        <span className="text-gray-700 max-w-xs truncate block">
          {composition}
        </span>
      );
    },
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
          { value: "all", label: "Tất cả trạng thái" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Không hoạt động" },
        ],
      },
    },
    cell: ({ getValue }: CellContext<Material, unknown>) => {
      const status = getValue() as Material["status"];
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
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
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
    cell: ({ row }: CellContext<Material, unknown>) => (
      <div className="flex items-center gap-2">
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
