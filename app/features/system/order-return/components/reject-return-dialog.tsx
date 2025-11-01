// components/reject-return-dialog.tsx
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { XCircle } from "lucide-react";
import type { ReturnStatus } from "../types";

type ReturnType = "exchange" | "return";

interface Customer {
  name: string;
  phone: string;
}

interface Product {
  name: string;
  sku: string;
  price: number;
  image: string;
}

interface Return {
  id: string;
  orderId: string;
  type: ReturnType;
  customer: Customer;
  product: Product;
  reason: string;
  description: string;
  status: ReturnStatus;
  requestDate: string;
  quantity: number;
}

interface RejectReturnDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  returnData: Return;
  onConfirm: () => void;
}

export default function RejectReturnDialog({
  open,
  setIsOpen,
  returnData,
  onConfirm,
}: RejectReturnDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Xác nhận từ chối phiếu
          </DialogTitle>
          <DialogDescription className="text-center">
            Bạn có chắc chắn muốn từ chối phiếu đổi/trả hàng này không?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Mã phiếu:</span>
              <span className="text-sm font-medium">{returnData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Khách hàng:</span>
              <span className="text-sm font-medium">
                {returnData.customer.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Sản phẩm:</span>
              <span className="text-sm font-medium">
                {returnData.product.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Lý do:</span>
              <span className="text-sm font-medium">{returnData.reason}</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-800">
              Sau khi từ chối, phiếu sẽ được chuyển sang trạng thái "Từ chối" và
              không thể hoàn tác. Vui lòng xem xét kỹ trước khi thực hiện.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
