import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { DeleteImportOrderDialogProps } from "../types";
import { deletePurchaseOrder } from "~/services/purchase-order";
import toast from "react-hot-toast";

export function DeleteImportOrderModal({
  open,
  order,
  onClose,
  onDelete,
}: DeleteImportOrderDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!order) return;

    // Kiểm tra trạng thái
    if (order.status.name !== "Draft") {
      toast.error("Chỉ có thể xóa đơn hàng ở trạng thái Bản nháp!");
      onClose();
      return;
    }

    setIsDeleting(true);
    try {
      await deletePurchaseOrder(String(order.purchaseOrderId));
      toast.success("Đã xóa đơn hàng thành công");
      onDelete(order);
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Xóa đơn hàng thất bại";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = order?.status.name === "Draft";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa đơn nhập hàng</AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                Bạn có chắc chắn muốn xóa đơn nhập hàng{" "}
                <span className="font-semibold text-destructive">
                  #{order?.purchaseOrderId}
                </span>{" "}
                không?
                <br />
                <br />
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến
                đơn hàng này sẽ bị xóa vĩnh viễn.
              </>
            ) : (
              <>
                <span className="text-red-600 font-semibold">
                  ⚠️ Không thể xóa đơn hàng này!
                </span>
                <br />
                <br />
                Đơn hàng đang ở trạng thái{" "}
                <span className="font-semibold">{order?.statusName}</span>.
                <br />
                Chỉ có thể xóa đơn hàng ở trạng thái <strong>Bản nháp</strong>.
                <br />
                <br />
                💡 Nếu muốn hủy đơn hàng ở trạng thái <strong>Chờ duyệt</strong>
                , vui lòng sử dụng chức năng <strong>"Hủy đơn"</strong> trong
                phần sửa đơn.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Đóng</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa đơn nhập hàng"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
