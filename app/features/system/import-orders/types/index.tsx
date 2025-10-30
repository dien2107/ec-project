import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { SortableHeader } from "../../components/data-table";
import { Edit, Trash2 } from "lucide-react";
import { formatVND } from "~/libs";
import type { Product as SharedProduct } from "~/types/product/product";

export interface ImportOrder {
  purchaseOrderId: number;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  statusId: number;
  statusName: string;
  status: {
    displayName: string;
    name: string;
    statusId: number;
    entityType: string;
  };
  totalAmount: number;
  items: ImportOrderItem[];
}

export interface ImportOrderItem {
  purchaseOrderItemId: number;
  productVariantId: number;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  profitPercentage: number;
  isPushed: boolean;
}

export interface ImportOrderFormData {
  supplier: string;
  quantity: number;
  total: number;
  status: "pending" | "approved" | "received";
  orderDate: string;
}

export interface AddImportOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (order: ImportOrder) => void;
}

export interface EditImportOrderDialogProps {
  open: boolean;
  order: ImportOrder | null;
  onClose: () => void;
  onSave: (order: ImportOrder) => void;
}

export interface DeleteImportOrderDialogProps {
  open: boolean;
  order: ImportOrder | null;
  onClose: () => void;
  onDelete: (order: ImportOrder) => void;
}

export interface Supplier {
  id: number;
  name: string;
  phone: string;
}

export type Product = SharedProduct;

export interface SelectedProduct extends Product {
  importQuantity: number;
  importPrice: number;
  profitMargin: number;
  suggestedPrice: number;
  totalPrice: number;
  code: string;
}
export interface ImportOrderAdd {
  supplier: string;
  products: {
    productVariantId: number;
    importQuantity: number;
    importPrice: number;
    profitMargin: number;
  }[];
  totalQuantity: number;
  totalAmount: number;
  orderDate: string;
  status: string;
}
export interface SelectedVariant {
  productId: number;
  productName: string;
  productCode: string;
  productVariantId: number;
  sku?: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  currentStock?: number;
  importQuantity: number;
  importPrice: number;
  profitMargin: number;
  suggestedPrice: number;
  totalPrice: number;
}
export interface AddImportOrderModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
}
export const statusMap: Record<string, { label: string; className: string }> = {
  Pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
  Approved: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800" },
};

export const getImportOrderColumns = (
  handleEdit: (order: ImportOrder) => void,
  handleDelete: (order: ImportOrder) => void
): ColumnDef<ImportOrder>[] => [
  {
    accessorKey: "purchaseOrderId",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Mã đơn hàng"
        className="justify-start"
      />
    ),
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Nhà cung cấp"
        className="justify-start"
      />
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Tổng tiền"
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => {
      const total = getValue() as number;
      return (
        <div className="text-right font-medium">
          {total.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "statusName",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Trạng thái"
        className="justify-start"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.status.name;
      const statusInfo = statusMap[status] || {
        label: row.original.statusName,
        className: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Ngày đặt"
        className="justify-start"
      />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex gap-2">
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
