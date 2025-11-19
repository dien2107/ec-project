import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { SortableHeader } from "../../components/data-table";
import { Edit, FilePenLine, Trash2, Eye } from "lucide-react";
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
  // Price is now at product level, not variant level
  productBasePrice: number; // Unit price for the product (same for all variants)
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
  Draft: { label: "Bản nháp", className: "bg-gray-100 text-gray-800" },
  Pending: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
  Approved: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800" },
  Ordered: { label: "Đã đặt hàng", className: "bg-indigo-100 text-indigo-800" },
  Received: {
    label: "Đã nhận hàng",
    className: "bg-purple-100 text-purple-800",
  },
  Completed: { label: "Hoàn tất", className: "bg-green-100 text-green-800" },
  Cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
};

// Workflow transitions cho từng status
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  Draft: ["Pending"],
  Pending: ["Approved"],
  Approved: ["Ordered"],
  Ordered: ["Received"],
  Received: ["Completed"],
  Completed: [],
  Cancelled: [],
};

export const getImportOrderColumns = (
  handleEdit: (order: ImportOrder) => void,
  handleDelete: (order: ImportOrder) => void,
  handleChangeStatus: (order: ImportOrder) => void,
  handleViewDetail: (order: ImportOrder) => void
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
      const order = row.original;
      const status = order.status?.name || order.statusName || "Draft";
      const statusInfo = statusMap[status] || {
        label: order.statusName || status || "Không rõ",
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
    cell: ({ row }) => {
      const order = row.original;
      const status = order.status?.name || order.statusName || "Draft";
      const canEdit = status === "Draft" || status === "Pending";
      const canDelete = status === "Draft";
      const canChangeStatus = status !== "Cancelled" && status !== "Completed";

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetail(order)}
            className="h-8 w-8 p-0 hover:bg-blue-100"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(order)}
            className="h-8 w-8 p-0 hover:bg-green-100"
            title={canEdit ? "Chỉnh sửa" : "Không thể chỉnh sửa"}
            disabled={!canEdit}
          >
            <Edit
              className={`h-4 w-4 ${canEdit ? "text-green-600" : "text-gray-400"}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(order)}
            className="h-8 w-8 p-0 hover:bg-red-100"
            title={canDelete ? "Xóa" : "Không thể xóa"}
            disabled={!canDelete}
          >
            <Trash2
              className={`h-4 w-4 ${canDelete ? "text-red-600" : "text-gray-400"}`}
            />
          </Button>
          {canChangeStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChangeStatus(order)}
              className="h-8 px-2 hover:bg-blue-100"
              title="Đổi trạng thái"
            >
              <span className="text-xs text-blue-600">
                <FilePenLine />
              </span>
            </Button>
          )}
        </div>
      );
    },
  },
];
