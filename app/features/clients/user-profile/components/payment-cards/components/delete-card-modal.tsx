import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface DeleteCardModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  cardNumber?: string;
}

export default function DeleteCardModal({
  open,
  setIsOpen,
  onDelete,
  cardNumber,
}: DeleteCardModalProps) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa thẻ</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa thẻ{" "}
            <strong>•••• {cardNumber?.slice(-4)}</strong>? Hành động này không
            thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
