import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  type DeletePaymentMethodDialogProps,
  type PaymentMethod,
} from "../types";

export default function DeletePaymentMethodDialog({
  open,
  setIsOpen,
  paymentMethod,
  onDelete,
}: DeletePaymentMethodDialogProps) {
  const handleDelete = () => {
    if (paymentMethod) {
      onDelete(paymentMethod.id);
      setIsOpen(false);
    }
  };

  if (!paymentMethod) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[470px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Xác nhận xóa phương thức thanh toán
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn xóa phương thức thanh toán này không?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900">
                Tên phương thức thanh toán:
              </span>
              <span className="text-gray-700 ml-2">{paymentMethod.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">Nhà cung cấp:</span>
              <span className="text-gray-700 ml-2 font-mono">
                {paymentMethod.provider}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa phương thức thanh toán
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
