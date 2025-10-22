import React from "react";
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

export function DeleteImportOrderModal({ open, order, onClose, onDelete }: DeleteImportOrderDialogProps) {
  const handleDelete = () => {
    if (order) {
      onDelete(order);
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa đơn nhập hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa đơn nhập hàng{" "}
            <span className="font-semibold text-destructive"></span> không?
            <br />
            <br />
            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến đơn hàng này sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa đơn nhập hàng
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
