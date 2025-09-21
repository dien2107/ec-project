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
import { type Category } from "../types";

interface DeleteCategoryDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  category: Category | null;
  onDelete: (categoryId: string) => void;
}

export default function DeleteCategoryDialog({
  open,
  setIsOpen,
  category,
  onDelete,
}: DeleteCategoryDialogProps) {
  const handleDelete = () => {
    if (category) {
      onDelete(category.id);
      setIsOpen(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Xác nhận xóa danh mục
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn xóa danh mục này không?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900">Tên danh mục:</span>
              <span className="text-gray-700 ml-2">{category.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">Mã danh mục:</span>
              <span className="text-gray-700 ml-2 font-mono">
                {category.id}
              </span>
            </div>
          </div>
          {category.productCount > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Cảnh báo:</strong> Danh mục này có{" "}
                {category.productCount} sản phẩm. Việc xóa danh mục có thể ảnh
                hưởng đến các sản phẩm này.
              </p>
            </div>
          )}
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
            Xóa danh mục
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
