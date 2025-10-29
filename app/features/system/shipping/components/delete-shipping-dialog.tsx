import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Ship } from "~/types/ship";
import { formatVND } from "~/libs";
import { toast } from "react-hot-toast";
import { deleteShipping } from "~/services/ships";
interface DeleteShippingDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  method: Ship | null;
  onDeleted: () => void;
}

export default function DeleteShippingDialog({
  open,
  setIsOpen,
  method,
  onDeleted,
}: DeleteShippingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!method) return;
    try {
      setIsLoading(true);
      await deleteShipping(method.shipId);
      toast.success("Xóa phương thức vận chuyển thành công!");
      onDeleted();
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa phương thức vận chuyển!");
      }
    } finally {
      setIsLoading(false);
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
              <span className="font-medium">{method.shipId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đơn vị:</span>
              <span className="font-medium">{method.corpName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-medium">
                {formatVND(Number(method.baseCost))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span className="ml-2">Đang xóa...</span>
              </>
            ) : (
              <>Xóa phương thức</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
