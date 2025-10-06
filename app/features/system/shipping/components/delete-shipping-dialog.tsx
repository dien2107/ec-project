import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { type ShippingMethod } from "../types";

interface DeleteShippingDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  method: ShippingMethod | null;
  onDelete: (methodId: string) => void;
}

export default function DeleteShippingDialog({
  open,
  setIsOpen,
  method,
  onDelete,
}: DeleteShippingDialogProps) {
  const handleDelete = () => {
    if (method) {
      onDelete(method.id);
      setIsOpen(false);
    }
  };

  if (!method) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl">
              Xác nhận xóa phương thức vận chuyển
            </DialogTitle>
          </div>
          <DialogDescription className="text-base pt-4">
            Bạn có chắc chắn muốn xóa phương thức vận chuyển{" "}
            <span className="font-semibold text-gray-900">
              "{method.corpName}"
            </span>{" "}
            không?
          </DialogDescription>
          <DialogDescription className="text-sm text-gray-600 pt-2">
            Hành động này không thể hoàn tác. Tất cả thông tin liên quan đến
            phương thức vận chuyển này sẽ bị xóa vĩnh viễn.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã:</span>
              <span className="font-medium">{method.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đơn vị:</span>
              <span className="font-medium">{method.corpName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(method.baseCost)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa phương thức
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
