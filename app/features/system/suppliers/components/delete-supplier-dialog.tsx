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
import type { DeleteSupplierDialogProps } from "../types";
import { deleteSupplier } from "~/services/supplier"; // hoặc đường dẫn service thực tế
import { toast } from "sonner";

export default function DeleteSupplierDialog({
  open,
  setIsOpen,
  supplierId,
  supplierName,
  onDeleted, 
}: DeleteSupplierDialogProps & { onDeleted?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!supplierId) return;
    setIsLoading(true);
    try {
      const res = await deleteSupplier(supplierId);
      if (res?.isSuccess) {
        toast.success("Đã xóa nhà cung cấp thành công!");
        onDeleted?.(); // refresh list
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Xóa nhà cung cấp thất bại!");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Không thể xóa nhà cung cấp. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa nhà cung cấp</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa nhà cung cấp{" "}
            <span className="font-semibold text-destructive">
              "{supplierName}"
            </span>{" "}
            không?
            <br />
            <br />
            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến nhà
            cung cấp này sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Đang xóa..." : "Xóa nhà cung cấp"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
