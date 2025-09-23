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
import type { DeleteSupplierDialogProps } from "../types/index";

export default function DeleteSupplierDialog({ 
  open, 
  setIsOpen, 
  onDelete, 
  supplierName 
}: DeleteSupplierDialogProps) {
  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa nhà cung cấp</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa nhà cung cấp{" "}
            <span className="font-semibold text-destructive">"{supplierName}"</span> không?
            <br />
            <br />
            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến nhà cung cấp này sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa nhà cung cấp
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
