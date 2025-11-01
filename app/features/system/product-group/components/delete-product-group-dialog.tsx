import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
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
import { deleteProductGroup } from "~/services/product-groups";
import type { ProductGroupDetailDto } from "~/types/product/product-group";

export default function DeleteProductGroupDialog({
  open,
  setIsOpen,
  selectedItem,
  onDeleted,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: ProductGroupDetailDto;
  onDeleted: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProductGroup(selectedItem.productGroupId);
      toast.success("Xóa nhóm sản phẩm thành công!");
      onDeleted();
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa nhóm sản phẩm!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa nhóm sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa nhóm sản phẩm{" "}
            <strong>{selectedItem.name}</strong>? Hành động này không thể hoàn
            tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Cảnh báo:</strong> Việc xóa nhóm sản phẩm này có thể ảnh hưởng
          đến các sản phẩm đang sử dụng nó. Hãy chắc chắn rằng không có sản phẩm
          nào đang dùng trước khi xóa.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#EF4444] text-white flex items-center gap-2"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang xóa...
              </>
            ) : (
              <>Xóa</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
