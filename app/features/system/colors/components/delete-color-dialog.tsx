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

interface DeleteColorDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  colorName?: string;
}

export default function DeleteColorDialog({ 
  open, 
  setIsOpen, 
  onDelete, 
  colorName 
}: DeleteColorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa màu sắc</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa màu sắc <strong>"{colorName}"</strong>?
            <br />
            Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm đang sử dụng màu này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa màu sắc
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}