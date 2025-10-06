import {
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Wallet,
  Banknote,
  Building,
} from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank_transfer" | "e_wallet" | "cash" | "credit_card";
  description: string;
  provider: string;
  accountInfo: string;
  transactionFee: number;
  status: "active" | "inactive";
  createdDate: string;
}
export interface BankAccount {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  enabled: boolean;
  logo: string;
}

export interface EWallet {
  id: number;
  name: string;
  identifier: string;
  ownerName: string;
  enabled: boolean;
  logo: string;
}
export interface AddPaymentMethodDialogProps {
  onSave: (methodData: Partial<PaymentMethod>) => void;
}
export const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Tên ngân hàng là bắt buộc"),
  accountName: z.string().min(1, "Tên chủ tài khoản là bắt buộc"),
  accountNumber: z.string().min(1, "Số tài khoản là bắt buộc"),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

export const bankOptions = [
  "Vietcombank",
  "Techcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "SacomBank",
  "VPBank",
  "TPBank",
  "MBBank",
  "HDBank",
];

export interface BankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBank?: any;
  onSave: (data: BankAccountFormValues) => void;
  onCancel: () => void;
}
export interface DeletePaymentMethodDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  paymentMethod: PaymentMethod | null;
  onDelete: (categoryId: string) => void;
}
export interface EditPaymentMethodDialog {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  paymentMethod: PaymentMethod | null;
  onSave: (categoryData: Partial<PaymentMethod>) => void;
}
export const eWalletSchema = z.object({
  name: z.string().min(1, "Tên ví điện tử là bắt buộc"),
  ownerName: z.string().min(1, "Tên chủ ví là bắt buộc"),
  identifier: z.string().min(1, "Số điện thoại/ID ví là bắt buộc"),
});

export type EWalletFormValues = z.infer<typeof eWalletSchema>;

export const walletOptions = [
  "MoMo",
  "ZaloPay",
  "ShopeePay",
  "ViettelPay",
  "VNPay",
  "PayPal",
  "GrabPay",
];

export interface EWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingWallet?: any;
  onSave: (data: EWalletFormValues) => void;
  onCancel: () => void;
}

export const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
  const iconProps = { className: "h-4 w-4" };
  switch (type) {
    case "bank_transfer":
      return <Building {...iconProps} />;
    case "e_wallet":
      return <Wallet {...iconProps} />;
    case "credit_card":
      return <CreditCard {...iconProps} />;
    case "cash":
      return <Banknote {...iconProps} />;
    default:
      return <CreditCard {...iconProps} />;
  }
};

export const getPaymentMethodTypeLabel = (type: PaymentMethod["type"]) => {
  switch (type) {
    case "bank_transfer":
      return "Chuyển khoản";
    case "e_wallet":
      return "Ví điện tử";
    case "credit_card":
      return "Thẻ tín dụng";
    case "cash":
      return "Tiền mặt";
    default:
      return type;
  }
};

export const getPaymentMethodTypeColor = (type: PaymentMethod["type"]) => {
  switch (type) {
    case "bank_transfer":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "e_wallet":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "credit_card":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "cash":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getColumns = (
  handleView: (method: PaymentMethod) => void,
  handleEdit: (method: PaymentMethod) => void,
  handleDelete: (method: PaymentMethod) => void
): ColumnDef<PaymentMethod>[] => [
  {
    accessorKey: "id",
    header: "Mã phương thức",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên phương thức",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ getValue }: CellContext<PaymentMethod, unknown>) => {
      const type = getValue() as PaymentMethod["type"];
      return (
        <Badge
          variant="secondary"
          className={`${getPaymentMethodTypeColor(type)} flex items-center gap-1 w-fit`}
        >
          {getPaymentMethodIcon(type)}
          {getPaymentMethodTypeLabel(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Nhà cung cấp",
    cell: ({ getValue }) => (
      <span className="text-gray-700">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }: CellContext<PaymentMethod, unknown>) => {
      const status = getValue() as PaymentMethod["status"];
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
    cell: ({ row }: CellContext<PaymentMethod, unknown>) => (
      <div className="flex items-center gap-2">
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => handleView(row.original)}
          className="h-8 w-8 p-0 hover:bg-blue-100"
          title="Xem chi tiết"
        >
          <Eye className="h-4 w-4 text-blue-600" />
        </Button> */}
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
