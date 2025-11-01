// components/approve-return-dialog.tsx
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
import { CheckCircle } from "lucide-react";
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

interface ApproveReturnDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  returnData: Return;
  onConfirm: () => void;
}

export default function ApproveReturnDialog({
  open,
  setIsOpen,
  returnData,
  onConfirm,
}: ApproveReturnDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Xác nhận duyệt phiếu
          </DialogTitle>
          <DialogDescription className="text-center">
            Bạn có chắc chắn muốn duyệt phiếu đổi/trả hàng này không?
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

          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              Sau khi duyệt, phiếu sẽ được chuyển sang trạng thái "Đã duyệt" và
              không thể hoàn tác.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Xác nhận duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
