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

interface DeleteSizeDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  sizeName?: string;
}

export default function DeleteSizeDialog({ 
  open, 
  setIsOpen, 
  onDelete, 
  sizeName 
}: DeleteSizeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa kích thước</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa kích thước <strong>"{sizeName}"</strong>?
            <br />
            Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm đang sử dụng kích thước này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa kích thước
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}